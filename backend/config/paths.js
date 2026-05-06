import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.join(__dirname, "../../frontend/data");
export const COMPANY_FILE = path.join(DATA_DIR, "company-info.json");
export const MOTORCYCLES_FILE = path.join(DATA_DIR, "motorcycles.json");
export const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
