import {
  ensureBookingsFile,
  readJSON,
  buildBookedSlots,
} from "../utils/fileStore.js";
import { BOOKINGS_FILE } from "../config/paths.js";

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connesso: ${socket.id}`);

    ensureBookingsFile();
    const bookings = readJSON(BOOKINGS_FILE) || [];
    socket.emit("slots_update", { bookedSlots: buildBookedSlots(bookings) });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnesso: ${socket.id}`);
    });
  });
}
