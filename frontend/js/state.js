// ==================== GLOBAL STATE ====================
const AppState = {
  currentStep: 1,
  formData: {},
  motorcycles: [],
  companyInfo: {},
  bookings: [],
  bookedSlots: {},
  socket: null,
  selectedMotoId: null,
  searchTerm: "",
  activeCategory: "",
  dateSlotsMap: {},
};

// Helper functions
function padTwo(n) {
  return String(n).padStart(2, "0");
}

function formatDateLabel(day, month, year) {
  return `${padTwo(day)}/${padTwo(month)}/${year}`;
}

function makeSlotKey(dateVal, motoId) {
  return `${dateVal}|${motoId}`;
}

function getTodayLocal() {
  const now = new Date();
  const y = now.getFullYear();
  const m = padTwo(now.getMonth() + 1);
  const d = padTwo(now.getDate());
  return `${y}-${m}-${d}`;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}
