import { Router } from "express";
import {
  ensureBookingsFile,
  readJSON,
  writeJSON,
  buildBookedSlots,
} from "../utils/fileStore.js";
import { BOOKINGS_FILE, COMPANY_FILE } from "../config/paths.js";
import { sendConfirmationEmails } from "../services/emailSender.js";

export default function bookingRoutes(io) {
  const router = Router();

  // Helper function to check session booking limits
  function checkSessionLimit(bookings, date, session, companyInfo) {
    const availableDay = companyInfo.testRideSettings.daysAvailable.find(
      day => day.day === date.split('/')[0] && 
            day.month === date.split('/')[1] && 
            day.year === date.split('/')[2]
    );
    
    if (!availableDay || !availableDay.sessionLimits) return { valid: true };
    
    const sessionConfig = availableDay.sessionLimits[session];
    
    if (!sessionConfig) return { valid: true };
    
    const sessionBookings = bookings.filter(booking => {
      return booking.date === date && booking.session === session;
    });
    
    return {
      valid: sessionBookings.length < sessionConfig.maxBookings,
      current: sessionBookings.length,
      max: sessionConfig.maxBookings,
      session: session === 'morning' ? 'Mattina' : 'Pomeriggio'
    };
  }

  // ── GET /api/bookings ──────────────────────────────────────────────────────
  router.get("/bookings", (req, res) => {
    ensureBookingsFile();
    res.json(readJSON(BOOKINGS_FILE) || []);
  });

  // ── POST /api/bookings ─────────────────────────────────────────────────────
  router.post("/bookings", async (req, res) => {
    try {
      const { booking, companyInfo } = req.body;

      if (!booking || !booking.date || !booking.session)
        return res
          .status(400)
          .json({ success: false, message: "Dati prenotazione incompleti" });

      ensureBookingsFile();
      const bookings = readJSON(BOOKINGS_FILE) || [];

      // Get company info for daily limits if not provided
      const companyData = companyInfo || readJSON(COMPANY_FILE);

      // Check session booking limits
      const sessionCheck = checkSessionLimit(bookings, booking.date, booking.session, companyData);
      if (!sessionCheck.valid) {
        return res.status(409).json({
          success: false,
          message: `Sessione ${sessionCheck.session} al completo. Max ${sessionCheck.max} posti, già prenotati ${sessionCheck.current}.`,
          sessionLimit: {
            session: sessionCheck.session,
            current: sessionCheck.current,
            max: sessionCheck.max
          }
        });
      }

      // Salva solo dati di disponibilità (no dati personali)
      const slotRecord = {
        id: Date.now().toString(),
        date: booking.date,
        session: booking.session,
        timestamp: new Date().toLocaleString("it-IT"),
      };

      bookings.push(slotRecord);
      writeJSON(BOOKINGS_FILE, bookings);

      io.emit("slots_update", { bookedSlots: buildBookedSlots(bookings) });
      io.emit("new_booking", {
        ...slotRecord,
        nome: booking.nome,
        cognome: booking.cognome,
      });

      if (companyInfo) {
        try {
          await sendConfirmationEmails(booking, companyInfo);
        } catch (e) {
          console.error("⚠️  Email non inviata:", e.message);
        }
      }

      console.log(
        `✅ Prenotazione: ${booking.nome} ${booking.cognome} — ` +
          `Guida Sicura — ${booking.date} ${booking.session}`,
      );
      res.status(201).json({ success: true, booking });
    } catch (error) {
      console.error("Errore prenotazione:", error);
      res.status(500).json({
        success: false,
        message: "Errore del server",
        error: error.message,
      });
    }
  });

  // ── DELETE /api/bookings/:id ───────────────────────────────────────────────
  router.delete("/bookings/:id", (req, res) => {
    try {
      ensureBookingsFile();
      let bookings = readJSON(BOOKINGS_FILE) || [];
      const before = bookings.length;
      bookings = bookings.filter((b) => b.id !== req.params.id);

      if (bookings.length === before)
        return res
          .status(404)
          .json({ success: false, message: "Prenotazione non trovata" });

      writeJSON(BOOKINGS_FILE, bookings);
      io.emit("slots_update", { bookedSlots: buildBookedSlots(bookings) });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  return router;
}
