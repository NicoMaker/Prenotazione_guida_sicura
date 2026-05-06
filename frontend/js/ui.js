// ==================== UI COMPONENTS ====================

function setSocketStatus(status) {
  const el = document.getElementById("socketStatus");
  const label = el.querySelector(".socket-label");
  el.className = "socket-status socket-" + status;
  if (status === "connected") label.textContent = "In tempo reale";
  if (status === "disconnected") label.textContent = "Disconnesso";
  if (status === "connecting") label.textContent = "Connessione…";
}

function showLoader(show) {
  document.getElementById("loader").classList.toggle("show", show);
}

function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icon =
    {
      info: "fa-info-circle",
      success: "fa-check-circle",
      warning: "fa-exclamation-triangle",
      error: "fa-times-circle",
    }[type] || "fa-info-circle";
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastOut .35s ease both";
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

function showSuccessModal(booking) {
  const [y, m, d] = booking.date.split("-");
  const dateFormatted = `${padTwo(d)}/${padTwo(m)}/${y}`;
  const sessionLabel = booking.session === 'morning' ? 'Mattina' : 'Pomeriggio';
  const messageEl = document.getElementById("successMessage");
  const modalEl = document.getElementById("successModal");
  
  if (messageEl && modalEl) {
    messageEl.textContent = `Prenotazione confermata per il ${dateFormatted} — Sessione ${sessionLabel}`;
    modalEl.classList.add("show");
  } else {
    console.error("Success modal elements not found");
    alert(`Prenotazione confermata per il ${dateFormatted} — Sessione ${sessionLabel}`);
  }
}

function closeSuccessModal() {
  const modalElement = document.getElementById("successModal");
  if (modalElement) {
    modalElement.classList.remove("show");
  }
}

function showErrorModal(message) {
  const errorElement = document.getElementById("errorMessage");
  const modalElement = document.getElementById("errorModal");
  
  if (errorElement && modalElement) {
    errorElement.innerHTML = message;
    modalElement.classList.add("show");
  } else {
    console.error("Error modal elements not found:", message);
    alert(message); // Fallback to alert if modal elements are not available
  }
}

function closeErrorModal() {
  const modalElement = document.getElementById("errorModal");
  if (modalElement) {
    modalElement.classList.remove("show");
  }
}

function updateFormView() {
  document
    .querySelectorAll(".form-step")
    .forEach((s) => s.classList.remove("active"));
  document
    .getElementById(`step${AppState.currentStep}`)
    .classList.add("active");

  const progress = (AppState.currentStep / 3) * 100;
  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById("currentStep").textContent = AppState.currentStep;

  if (AppState.currentStep === 3) updateSummary();
  if (AppState.currentStep === 2) refreshTimeSlotsUI();
}

function updateSummary() {
  document.getElementById("summaryNome").textContent =
    AppState.formData.nome || "-";
  document.getElementById("summaryCognome").textContent =
    AppState.formData.cognome || "-";
  document.getElementById("summaryEmail").textContent =
    AppState.formData.email || "-";
  document.getElementById("summaryTelefono").textContent =
    AppState.formData.telefono || "-";

  const dateVal = document.getElementById("date").value;
  let dateText = "-";
  if (dateVal) {
    const [y, m, d] = dateVal.split("-");
    const dateObj = new Date(dateVal + "T00:00:00");
    const dayName = dateObj.toLocaleDateString("it-IT", { weekday: "long" });
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    dateText = `${cap(dayName)} ${padTwo(d)}/${padTwo(m)}/${y}`;
  }
  document.getElementById("summaryDate").textContent = dateText;
  document.getElementById("summarySession").textContent = 
    AppState.formData.session === 'morning' ? 'Mattina' : 
    AppState.formData.session === 'afternoon' ? 'Pomeriggio' : '-';
}
