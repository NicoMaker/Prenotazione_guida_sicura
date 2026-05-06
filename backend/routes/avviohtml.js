// routes/avvioHtml.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ========================================
// 🏠 SERVE INDEX.HTML PER TUTTE LE ROUTE NON-API (SPA)
// ========================================

router.use((req, res, next) => {
  // Escludi le route che iniziano con /api
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
  } else {
    next();
  }
});

export default router;
