// ==================== FORM HANDLING ====================

function nextStep(currentStep) {
  if (validateStep(currentStep)) {
    saveStepData(currentStep);
    AppState.currentStep = currentStep + 1;
    updateFormView();
  }
}

function prevStep(currentStep) {
  AppState.currentStep = currentStep - 1;
  updateFormView();
}

function validateStep(step) {
  if (step === 2) {
    let isValid = true;
    if (!document.getElementById("date").value) {
      document.getElementById("dateError").textContent = "Seleziona una data";
      isValid = false;
    } else {
      document.getElementById("dateError").textContent = "";
    }
    
    const selectedSession = document.querySelector('input[name="session"]:checked');
    if (!selectedSession) {
      document.getElementById("sessionError").textContent = "Seleziona una sessione";
      isValid = false;
    } else {
      document.getElementById("sessionError").textContent = "";
    }
    
        return isValid;
  }

  const inputs = document
    .getElementById(`step${step}`)
    .querySelectorAll("[required]");
  let isValid = true;
  inputs.forEach((input) => {
    if (!validateInput(input)) isValid = false;
  });
  return isValid;
}

function validateInput(input) {
  const value = input.value.trim();
  const errorId = input.id + "Error";
  const errorElement = document.getElementById(errorId);
  let isValid = true;
  let errorMessage = "";

  if (!value) {
    isValid = false;
    errorMessage = "Questo campo è obbligatorio";
  } else {
    if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      errorMessage = "Email non valida";
    }
    if (
      input.type === "tel" &&
      !/^[\d\s\+\-\(\)]+$/.test(value) &&
      value.replace(/\D/g, "").length < 10
    ) {
      isValid = false;
      errorMessage = "Numero di telefono non valido";
    }
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
    input.classList.toggle("error-field", !isValid);
  }
  return isValid;
}

function saveStepData(step) {
  if (step === 1) {
    AppState.formData.nome = document.getElementById("nome").value;
    AppState.formData.cognome = document.getElementById("cognome").value;
    AppState.formData.email = document.getElementById("email").value;
    AppState.formData.telefono = document.getElementById("telefono").value;
  } else if (step === 2) {
    AppState.formData.date = document.getElementById("date").value;
    const selectedSession = document.querySelector('input[name="session"]:checked');
    AppState.formData.session = selectedSession ? selectedSession.value : "";
  }
}

function resetForm() {
  document.getElementById("testRideForm").reset();
  AppState.currentStep = 1;
  AppState.formData = {};

  document
    .querySelectorAll(".date-slot")
    .forEach((s) => s.classList.remove("selected"));
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

  const settings = AppState.companyInfo?.testRideSettings;
  if (settings?.daysAvailable) {
    document.getElementById("dateSlotsContainer").innerHTML = "";
    document.getElementById("date").innerHTML =
      '<option value="">Seleziona data...</option>';
    AppState.dateSlotsMap = {};
    loadDates(settings.daysAvailable);
  }

  updateFormView();
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!document.getElementById("terms").checked) {
    document.getElementById("termsError").textContent =
      "Devi accettare i termini e le condizioni";
    return;
  }

  const dateVal = document.getElementById("date").value;
  const session = AppState.formData.session;
  const key = `${dateVal}|${session}`;

  // No need to check conflicts since we're using session-based availability

  showLoader(true);

  try {
    const booking = {
      id: Date.now().toString(),
      nome: AppState.formData.nome,
      cognome: AppState.formData.cognome,
      email: AppState.formData.email,
      telefono: AppState.formData.telefono,
      date: dateVal,
      session: session,
      timestamp: new Date().toLocaleString("it-IT"),
    };

    const response = await submitBooking(booking);
    const result = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        const [y, m, d] = dateVal.split("-");
        const dateFormatted = `${padTwo(d)}/${padTwo(m)}/${y}`;
        
        // Check if it's a session limit error
        if (result.sessionLimit) {
          showErrorModal(
            `<strong>Sessione al completo</strong><br><br>` +
              `La sessione <strong>${result.sessionLimit.session}</strong> del <strong>${dateFormatted}</strong> ` +
              `ha raggiunto il massimo di <strong>${result.sessionLimit.max}</strong> posti.<br><br>` +
              `Posti già prenotati: <strong>${result.sessionLimit.current}</strong><br><br>` +
              `Per favore seleziona un orario in un'altra sessione.`,
          );
        } else {
          showErrorModal(
            `<strong>Sessione non più disponibile</strong><br><br>` +
              `La sessione <strong>${session === 'morning' ? 'Mattina' : 'Pomeriggio'}</strong> ` +
              `del <strong>${dateFormatted}</strong> ` +
              `è al completo.<br><br>` +
              `Per favore seleziona un'altra sessione.`,
          );
        }
        
        AppState.currentStep = 2;
        updateFormView();
      } else {
        throw new Error(result.message || "Errore prenotazione");
      }
      showLoader(false);
      return;
    }

    showLoader(false);
    showSuccessModal(booking);
    resetForm();
  } catch (error) {
    showLoader(false);
    console.error("Errore nella prenotazione:", error);
    showErrorModal(
      error.message || "Errore durante la prenotazione. Riprovare.",
    );
  }
}
