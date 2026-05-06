import fs from "fs";
import { BOOKINGS_FILE } from "../config/paths.js";

export function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function ensureBookingsFile() {
  if (!fs.existsSync(BOOKINGS_FILE)) writeJSON(BOOKINGS_FILE, []);
}

export function buildBookedSlots(bookings) {
  const map = {};
  bookings.forEach((b) => {
    const key = `${b.date}|${b.session}`;
    if (!map[key]) map[key] = [];
    map[key].push({
      id: b.id,
      timestamp: b.timestamp
    });
  });
  return map;
}
