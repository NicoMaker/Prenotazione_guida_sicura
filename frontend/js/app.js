// ==================== MAIN APP INITIALIZATION ====================

function initSocket() {
  AppState.socket = io();

  AppState.socket.on("connect", () => setSocketStatus("connected"));
  AppState.socket.on("disconnect", () => setSocketStatus("disconnected"));
  AppState.socket.on("connect_error", () => setSocketStatus("disconnected"));

  AppState.socket.on("slots_update", (data) => {
    AppState.bookedSlots = data.bookedSlots || {};
    updateSessionAvailability();
  });

  AppState.socket.on("new_booking", (booking) => {
    // Don't add to bookedSlots here - slots_update will handle it
    // This prevents double counting
    updateSessionAvailability();
  });
}

function setupEventListeners() {
  document
    .getElementById("testRideForm")
    .addEventListener("submit", handleFormSubmit);

  // Step navigation buttons
  document
    .getElementById("nextStep1Btn")
    .addEventListener("click", () => nextStep(1));
  document
    .getElementById("prevStep2Btn")
    .addEventListener("click", () => prevStep(2));
  document
    .getElementById("nextStep2Btn")
    .addEventListener("click", () => nextStep(2));
  document
    .getElementById("prevStep3Btn")
    .addEventListener("click", () => prevStep(3));

  // Session selection event listeners
  document.querySelectorAll('input[name="session"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.formData.selectedSession = e.target.value;
      document.getElementById("sessionError").textContent = "";
    });
  });
}

function updateSessionAvailability() {
  const dateVal = document.getElementById("date").value;
  if (!dateVal) return;

  ['morning', 'afternoon'].forEach(session => {
    const key = `${dateVal}|${session}`;
    const bookings = AppState.bookedSlots[key] || [];
    const available = 30 - bookings.length;
    
    const counter = document.querySelector(`[data-session="${session}"] .availability-counter`);
    if (counter) {
      counter.textContent = available;
      
      // Disable session if no availability
      const radio = document.querySelector(`[data-session="${session}"] input[type="radio"]`);
      const option = document.querySelector(`[data-session="${session}"]`);
      
      if (available <= 0) {
        radio.disabled = true;
        option.classList.add('disabled');
      } else {
        radio.disabled = false;
        option.classList.remove('disabled');
      }
    }
  });
}

function setupModalHandlers() {
  // Gestisce tutti i pulsanti chiudi e il click sull'overlay con un unico listener,
  // evitando problemi di timing o di elementi non ancora nel DOM.
  document.addEventListener("click", (e) => {
    // Click sull'overlay (sfondo scuro)
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("show");
      return;
    }

    // Risali fino all'elemento con id (gestisce anche click su icone figlie)
    const el = e.target.closest(
      "#closeBookingsModal, #closeSuccessModal, #closeSuccessBtn, #closeErrorModal, #closeErrorBtn",
    );
    if (!el) return;

    e.preventDefault();
    e.stopPropagation();

    switch (el.id) {
      case "closeBookingsModal":
        document.getElementById("bookingsModal").classList.remove("show");
        break;
      case "closeSuccessModal":
      case "closeSuccessBtn":
        closeSuccessModal();
        break;
      case "closeErrorModal":
      case "closeErrorBtn":
        document.getElementById("errorModal").classList.remove("show");
        break;
    }
  });
}

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
  initSocket();
  await loadAllData();
  setupEventListeners();
  setupModalHandlers();
  updateFormView();
});
