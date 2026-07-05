document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('modifyStayForm');
  const btnReset = document.getElementById('btnReset');
  
  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');
  const selectGuests = document.getElementById('selectGuests');
  const selectRoomType = document.getElementById('selectRoomType');

  const checkinError = document.getElementById('checkinError');
  const checkoutError = document.getElementById('checkoutError');
  const btnCheckAvailability = document.getElementById('btnCheckAvailability');

  // Default values backup for Reset action
  const defaultCheckin = "2026-06-25";
  const defaultCheckout = "2026-06-30";
  const defaultGuests = "4";
  const defaultRoomType = "family";

  // 1. Reset Click Handler
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      checkinInput.value = defaultCheckin;
      checkoutInput.value = defaultCheckout;
      selectGuests.value = defaultGuests;
      selectRoomType.value = defaultRoomType;
      
      clearFieldStyles(checkinInput, checkinError);
      clearFieldStyles(checkoutInput, checkoutError);
      validateFormState();
    });
  }

  function clearFieldStyles(input, errorEl) {
    input.classList.remove('is-invalid', 'is-valid');
    if (errorEl) {
      errorEl.classList.add('d-none');
      errorEl.classList.remove('text-danger', 'text-success');
      errorEl.textContent = '';
    }
  }

  // Bind change and input event listeners to calendar date picker
  if (checkinInput) {
    checkinInput.addEventListener('input', validateFormState);
    checkinInput.addEventListener('change', validateFormState);
  }
  if (checkoutInput) {
    checkoutInput.addEventListener('input', validateFormState);
    checkoutInput.addEventListener('change', validateFormState);
  }

  function parseFormattedDate(str) {
    if (!str) return null;
    // Native date type input values are formatted as YYYY-MM-DD
    const parts = str.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (month < 1 || month > 12) return null;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return null;

    return new Date(year, month - 1, day);
  }

  function validateFormState() {
    let isValid = true;

    // Reset check-in styles
    clearFieldStyles(checkinInput, checkinError);
    // Reset check-out styles
    clearFieldStyles(checkoutInput, checkoutError);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkinDate = null;
    let checkoutDate = null;

    // Validate Check-in date input
    if (!checkinInput.value) {
      isValid = false;
    } else {
      checkinDate = parseFormattedDate(checkinInput.value);
      if (!checkinDate) {
        isValid = false;
        checkinInput.classList.add('is-invalid');
        checkinError.textContent = '❌ Enter a valid check-in date.';
        checkinError.classList.add('text-danger');
        checkinError.classList.remove('d-none');
      } else if (checkinDate < today) {
        isValid = false;
        checkinInput.classList.add('is-invalid');
        checkinError.textContent = '❌ Check-in date cannot be in the past.';
        checkinError.classList.add('text-danger');
        checkinError.classList.remove('d-none');
      } else {
        checkinInput.classList.add('is-valid');
        checkinError.textContent = '✓ Check-in looks good.';
        checkinError.classList.add('text-success');
        checkinError.classList.remove('d-none');
      }
    }

    // Validate Check-out date input
    if (!checkoutInput.value) {
      isValid = false;
    } else {
      checkoutDate = parseFormattedDate(checkoutInput.value);
      if (!checkoutDate) {
        isValid = false;
        checkoutInput.classList.add('is-invalid');
        checkoutError.textContent = '❌ Enter a valid check-out date.';
        checkoutError.classList.add('text-danger');
        checkoutError.classList.remove('d-none');
      } else if (checkinDate && checkoutDate <= checkinDate) {
        isValid = false;
        checkoutInput.classList.add('is-invalid');
        checkoutError.textContent = '❌ Check-out date must be after check-in.';
        checkoutError.classList.add('text-danger');
        checkoutError.classList.remove('d-none');
      } else {
        checkoutInput.classList.add('is-valid');
        checkoutError.textContent = '✓ Check-out looks good.';
        checkoutError.classList.add('text-success');
        checkoutError.classList.remove('d-none');
      }
    }

    if (btnCheckAvailability) {
      if (isValid) {
        btnCheckAvailability.removeAttribute('disabled');
      } else {
        btnCheckAvailability.setAttribute('disabled', 'true');
      }
    }

    return isValid;
  }

  // Bind key handlers to init state checking
  if (checkinInput) checkinInput.addEventListener('blur', validateFormState);
  if (checkoutInput) checkoutInput.addEventListener('blur', validateFormState);

  // Initialize form validation
  validateFormState();

  // 2. Submit Handler Validation Check
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateFormState()) {
        // Display the Room Booking Policy Confirmation modal before redirecting
        window.policyModal.show({
          title: 'Review Room Booking Policies',
          policyType: 'booking',
          onContinue: () => {
            window.location.href = 'modify_booking_step2.html';
          },
          onBack: () => {
            console.log('User cancelled booking policy agreement');
          }
        });
      }
    });
  }
});
