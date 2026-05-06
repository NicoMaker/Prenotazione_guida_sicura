// ==================== API CALLS ====================

async function loadAllData() {
  try {
    const companyRes = await fetch("/api/company-info");
    const companyData = await companyRes.json();
    AppState.companyInfo = companyData;
    applyCompanyInfo(companyData);

    const motoRes = await fetch("/api/motorcycles");
    AppState.motorcycles = await motoRes.json();
    renderMotorcyclesGrid();
    renderCategoryChips();

    const bookRes = await fetch("/api/bookings");
    if (bookRes.ok) {
      AppState.bookings = await bookRes.json();
      rebuildBookedSlots();
    }
  } catch (error) {
    console.error("Errore caricamento:", error);
    showToast("Errore nel caricamento dei dati", "error");
  }
}

function applyCompanyInfo(data) {
  const c = data.company;
  const settings = data.testRideSettings;

  document.getElementById("companyName").textContent =
    c.name || "Palmino Motors";
  document.getElementById("companySubtitle").textContent =
    `${c.address} · ${c.city}`;
  document.getElementById("companyAddress").textContent =
    `${c.address}, ${c.city}${c.cap ? " " + c.cap : ""}`;

  if (c.mapsUrl) document.getElementById("companyMapsLink").href = c.mapsUrl;
  document.getElementById("companyPhoneLink").href =
    `tel:${(c.phone || "").replace(/\s/g, "")}`;
  document.getElementById("companyPhoneLink").textContent = c.phone || "";
  document.getElementById("companyEmailLink").href = `mailto:${c.email || ""}`;
  document.getElementById("companyEmailLink").textContent = c.email || "";

  if (c.piva) {
    document.getElementById("pivaRow").style.display = "flex";
    document.getElementById("companyPiva").textContent = `P. IVA ${c.piva}`;
    document.getElementById("footerPiva").style.display = "block";
    document.getElementById("footerPiva").textContent = `P. IVA ${c.piva}`;
  }

  if (c.whatsapp) {
    document.getElementById("whatsappLink").href =
      `https://wa.me/${c.whatsapp}?text=Ciao%2C%20vorrei%20informazioni%20sul%20Test%20Ride!`;
  }

  if (settings?.durationMinutes) {
    document.getElementById("durationLabel").textContent =
      settings.durationMinutes;
  }

  document.getElementById("footerText").textContent =
    `© 2026 ${c.name || "Palmino Motors"} · Tutti i diritti riservati`;

  if (settings?.daysAvailable) {
    loadDates(settings.daysAvailable, settings.defaultTimeSlots);
  }
}

function rebuildBookedSlots() {
  AppState.bookedSlots = {};
  AppState.bookings.forEach((b) => {
    const key = makeSlotKey(b.date, b.motorcycleId);
    if (!AppState.bookedSlots[key]) AppState.bookedSlots[key] = [];
    if (!AppState.bookedSlots[key].includes(b.time))
      AppState.bookedSlots[key].push(b.time);
  });
}

async function submitBooking(booking) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ booking, companyInfo: AppState.companyInfo }),
  });
  return response;
}
