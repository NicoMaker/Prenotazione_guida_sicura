// ==================== DATE & TIME SLOTS ====================

function getAutoSelectDate(availableDates) {
  if (!availableDates || availableDates.length === 0) return null;
  const today = getTodayLocal();
  const future = availableDates.filter((d) => d >= today);
  if (future.length > 0) return future[0];
  return availableDates[availableDates.length - 1];
}

function loadDates(daysAvailable) {
  const dateSelect = document.getElementById("date");
  const container = document.getElementById("dateSlotsContainer");
  AppState.dateSlotsMap = {};
  const availableDateValues = [];

  if (!dateSelect || !container) {
    console.error("Required DOM elements not found: date or dateSlotsContainer");
    return;
  }

  daysAvailable.forEach((day) => {
    if (!day.available) return;
    const month = padTwo(day.month);
    const d = padTwo(day.day);
    const value = `${day.year}-${month}-${d}`;
    const label = formatDateLabel(day.day, day.month, day.year);
    // For session-based system, we don't need time slots
    AppState.dateSlotsMap[value] = [];
    availableDateValues.push(value);

    const option = document.createElement("option");
    option.value = value;
    option.textContent = `${day.dayName} ${label}`;
    dateSelect.appendChild(option);

    const card = document.createElement("div");
    card.className = "date-slot";
    card.dataset.value = value;
    card.innerHTML = `<span class="slot-day-name">${day.dayName}</span><span class="slot-date">${label}</span>`;
    card.addEventListener("click", () => selectDateCard(value, card));
    container.appendChild(card);
  });

  const autoDate = getAutoSelectDate(availableDateValues);
  if (autoDate) {
    const autoCard = container.querySelector(`[data-value="${autoDate}"]`);
    if (autoCard) selectDateCard(autoDate, autoCard, true);
  }
}

function selectDateCard(value, card, silent = false) {
  if (!card) {
    console.error("Card element is null in selectDateCard");
    return;
  }

  document
    .querySelectorAll(".date-slot")
    .forEach((s) => s.classList.remove("selected"));
  card.classList.add("selected");
  
  const dateSelect = document.getElementById("date");
  if (dateSelect) dateSelect.value = value;
  
  AppState.formData.selectedDate = value;
  if (!silent) {
    const dateError = document.getElementById("dateError");
    if (dateError) dateError.textContent = "";
  }

  // Reset session selection when date changes
  document.querySelectorAll('input[name="session"]').forEach(radio => {
    radio.checked = false;
  });
  AppState.formData.selectedSession = "";
  const sessionError = document.getElementById("sessionError");
  if (sessionError) sessionError.textContent = "";

  loadTimeSlotsForDate(value);

  const timeSelect = document.getElementById("time");
  const time = timeSelect ? timeSelect.value : "";
  const slots = AppState.dateSlotsMap[value] || [];
  if (time && !slots.includes(time)) {
    if (timeSelect) timeSelect.value = "";
    AppState.formData.selectedTime = "";
    document
      .querySelectorAll(".time-slot")
      .forEach((s) => s.classList.remove("selected"));
  }
}

function loadTimeSlotsForDate(dateVal) {
  const allSlots = AppState.dateSlotsMap[dateVal] || [];
  const selectedSession = AppState.formData.selectedSession;
  
  // Get company info for session filtering
  const companyInfo = AppState.companyInfo;
  const [year, month, day] = dateVal.split('-');
  const availableDay = companyInfo?.testRideSettings?.daysAvailable?.find(
    day => day.day === day && 
          day.month === month && 
          day.year === year
  );
  
  let slots = [];
  if (selectedSession && availableDay?.sessionLimits?.[selectedSession]) {
    slots = availableDay.sessionLimits[selectedSession].slots;
  } else {
    slots = []; // Don't show any slots until session is selected
  }
  
  const timeSelect = document.getElementById("time");
  const container = document.getElementById("timeSlotsContainer");

  if (timeSelect) {
    timeSelect.innerHTML = '<option value="">Seleziona orario...</option>';
    slots.forEach((slot) => {
      const opt = document.createElement("option");
      opt.value = slot;
      opt.textContent = slot;
      timeSelect.appendChild(opt);
    });
  }

  if (container) {
    container.innerHTML = "";
    
    if (!selectedSession) {
      container.innerHTML = '<div class="no-session-selected">Seleziona prima Mattina o Pomeriggio</div>';
      return;
    }
  } else if (!selectedSession) {
    console.warn("timeSlotsContainer not found, but no session selected");
    return;
  }
  
  const key = dateVal; // Simple key for date-based bookings
  const booked = key ? AppState.bookedSlots[key] || [] : [];

  if (container) {
    slots.forEach((slot) => {
      const btn = document.createElement("div");
      const isBooked = booked.includes(slot);
      btn.className = "time-slot" + (isBooked ? " booked" : "");
      btn.textContent = slot;
      btn.dataset.slot = slot;

      if (!isBooked) {
        btn.addEventListener("click", () => {
          document
            .querySelectorAll(".time-slot")
            .forEach((s) => s.classList.remove("selected"));
          btn.classList.add("selected");
          const timeSelect = document.getElementById("time");
          if (timeSelect) timeSelect.value = slot;
          AppState.formData.selectedTime = slot;
          const timeError = document.getElementById("timeError");
          if (timeError) timeError.textContent = "";
        });
      }

      container.appendChild(btn);
    });
  }
}

function refreshTimeSlotsUI() {
  // This function is no longer needed for session-based system
  // Session availability is handled by updateSessionAvailability()
  updateSessionAvailability();
}
