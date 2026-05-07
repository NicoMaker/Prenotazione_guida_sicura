import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import { initEmailTransporter } from "./services/email.js";
import { registerSocketHandlers } from "./sockets/bookingSocket.js";
import companyRoutes from "./routes/company.js";
import bookingRoutes from "./routes/bookings.js";
import avvioHtmlRouter from "./routes/avviohtml.js"; // ← IMPORT DEL NUOVO ROUTER
import { getLocalIP, getPublicIP } from "./utils/network.js";
import { BOOKINGS_FILE } from "./config/paths.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);
const PORT = 3003;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Servi file statici del frontend (CSS, JS, immagini, ecc.)
app.use(express.static(path.join(__dirname, "../frontend")));

// ── Services ────────────────────────────────────────────────────────────────
initEmailTransporter();

// ── Socket.IO ───────────────────────────────────────────────────────────────
registerSocketHandlers(io);

// ── Routes API (DEVONO ESSERE PRIMA del router HTML) ────────────────────────
app.use("/api", companyRoutes);
app.use("/api", bookingRoutes(io));

// ── Health ──────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// ⭐ IMPORTANTE: Il router HTML deve andare DOPO tutte le route API
// ma PRIMA dell'error handler
app.use(avvioHtmlRouter); // ← SERVE index.html per tutte le altre route

// ── Error handler (DEVE ANDARE DOPO il router HTML) ─────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ success: false, message: "Errore del server", error: err.message });
});

// ── Start ───────────────────────────────────────────────────────────────────
httpServer.listen(PORT, "0.0.0.0", async () => {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();
  
  // Initialize email service
  initEmailTransporter();
  
  console.log("✅  Server avviato con Socket.io");
  console.log(`📍  Localhost:    http://localhost:${PORT}`);
  console.log(`🏠  Rete locale:  http://${localIP}:${PORT}`);
  if (publicIP) console.log(`🌐  IP Pubblico:  http://${publicIP}:${PORT}`);
  console.log(`📂  Prenotazioni: ${BOOKINGS_FILE}`);
});
