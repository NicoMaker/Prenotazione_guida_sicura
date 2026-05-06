import { Router } from "express";
import { readJSON } from "../utils/fileStore.js";
import { COMPANY_FILE } from "../config/paths.js";

const router = Router();

router.get("/company-info", (req, res) => {
  const data = readJSON(COMPANY_FILE);
  if (!data)
    return res.status(500).json({ error: "Errore caricamento dati azienda" });
  res.json(data);
});

export default router;
