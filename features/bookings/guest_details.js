document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('stayDetailsForm');
  const guestCountInput = document.getElementById('guestCount');
  const checkinInput = document.getElementById('checkinDate');
  const checkoutInput = document.getElementById('checkoutDate');
  const specialRequestsTextarea = document.getElementById('specialRequests');
  const charCounter = document.getElementById('charCounter');
  const btnConfirmBooking = document.getElementById('btnConfirmBooking');

  // Input fields error flags
  const guestErrorMsg = document.getElementById('guestErrorMsg');
  const dateErrorMsg = document.getElementById('dateErrorMsg');

  // Event Listeners for enabling/disabling Submit button
  const formInputs = [guestCountInput, checkinInput, checkoutInput];
  formInputs.forEach(input => {
    input.addEventListener('input', validateFormState);
  });

  // Helper for applying error styles
  function setFieldError(input, errorEl, message) {
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.remove('d-none');
      input.style.borderColor = '#dc3545';
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('d-none');
      input.style.borderColor = '';
    }
  }

  // 1. Textarea Character Live Counter
  if (specialRequestsTextarea && charCounter) {
    specialRequestsTextarea.addEventListener('input', () => {
      const count = specialRequestsTextarea.value.length;
      charCounter.textContent = `${count} / 300`;
      
      if (count > 300) {
        specialRequestsTextarea.value = specialRequestsTextarea.value.substring(0, 300);
        charCounter.textContent = `300 / 300`;
      }
    });
  }

  // Real-time input keydown, paste, change protections
  const handleDateInputRestrictions = (e) => {
    const input = e.target;
    
    // Prevent typing extra year digits manually
    if (e.type === 'keypress') {
      const parts = input.value.split('-'); // yyyy-mm-dd
      if (parts[0] && parts[0].length >= 4) {
        // Find selection start to see if user is replacing text
        if (input.selectionStart !== null && input.selectionStart <= 4) {
          // If cursor is in the year part and selection doesn't cover characters, block it
          if (input.selectionEnd - input.selectionStart === 0) {
            e.preventDefault();
          }
        }
      }
    }
  };

  checkinInput.addEventListener('keypress', handleDateInputRestrictions);
  checkoutInput.addEventListener('keypress', handleDateInputRestrictions);

  const checkinErrorEl = document.getElementById('checkinErrorMsg');
  const checkoutErrorEl = document.getElementById('checkoutErrorMsg');

  // Input sanitization: Block keys that are not numbers or dashes
  const handleKeydownSanitization = (e) => {
    // Allow navigation keys, backspace, delete, tab
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(e.key)) return;

    // Reject non-digit or non-dash characters
    if (!/^[0-9\-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Input auto-formatter: automatically inject dashes for DD-MM-YYYY
  const handleInputFormat = (e) => {
    const input = e.target;
    let val = input.value.replace(/[^0-9]/g, ''); // strip non-digits
    
    if (val.length > 2 && val.length <= 4) {
      input.value = val.slice(0, 2) + '-' + val.slice(2);
    } else if (val.length > 4) {
      input.value = val.slice(0, 2) + '-' + val.slice(2, 4) + '-' + val.slice(4, 8);
    }
    validateFormState();
  };

  checkinInput.addEventListener('keydown', handleKeydownSanitization);
  checkoutInput.addEventListener('keydown', handleKeydownSanitization);
  checkinInput.addEventListener('input', handleInputFormat);
  checkoutInput.addEventListener('input', handleInputFormat);
  checkinInput.addEventListener('change', validateFormState);
  checkoutInput.addEventListener('change', validateFormState);

  // Helper Form State Validator
  function validateFormState() {
    let isValid = true;

    // Guest check - minimum count should not be 0 or negative
    const countVal = parseInt(guestCountInput.value);
    if (!guestCountInput.value || isNaN(countVal) || countVal < 1) {
      isValid = false;
      guestErrorMsg.textContent = 'Guest count must be at least 1.';
      guestErrorMsg.classList.remove('d-none');
      guestCountInput.style.borderColor = '#dc3545';
    } else if (countVal > 4) {
      isValid = false;
      guestErrorMsg.textContent = 'Guest count exceeds maximum room capacity (Max 4 Guests).';
      guestErrorMsg.classList.remove('d-none');
      guestCountInput.style.borderColor = '#dc3545';
    } else {
      guestErrorMsg.classList.add('d-none');
      guestCountInput.style.borderColor = '';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDateDDMMYYYY = (str) => {
      const parts = str.split('-');
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      // Ensure month/day/year are numeric and valid limits
      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      if (month < 1 || month > 12) return null;
      if (day < 1 || day > 31) return null;
      
      // Confirm actual calendar days in that month
      const dt = new Date(year, month - 1, day);
      if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return null;
      return dt;
    };

    // Reset validation styles
    setFieldError(checkinInput, checkinErrorEl, '');
    setFieldError(checkoutInput, checkoutErrorEl, '');

    const datePattern = /^\d{2}-\d{2}-\d{4}$/;

    // 1. Check-In Date format & business logic validation
    let checkinDateObj = null;
    if (!checkinInput.value) {
      isValid = false;
    } else if (!datePattern.test(checkinInput.value)) {
      isValid = false;
      setFieldError(checkinInput, checkinErrorEl, 'Please enter the date in DD-MM-YYYY format.');
    } else {
      checkinDateObj = parseDateDDMMYYYY(checkinInput.value);
      const parts = checkinInput.value.split('-');
      const year = parseInt(parts[2], 10);
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;

      if (!checkinDateObj) {
        isValid = false;
        setFieldError(checkinInput, checkinErrorEl, 'Please enter a valid date.');
      } else if (parts[2].length !== 4 || year < currentYear || year > nextYear) {
        isValid = false;
        setFieldError(checkinInput, checkinErrorEl, 'Reservations can only be made up to 365 days in advance.');
      } else {
        const oneYearFromToday = new Date(today);
        oneYearFromToday.setDate(oneYearFromToday.getDate() + 365);
        
        if (checkinDateObj < today) {
          isValid = false;
          setFieldError(checkinInput, checkinErrorEl, 'Check-In must be today or a future date.');
        } else if (checkinDateObj > oneYearFromToday) {
          isValid = false;
          setFieldError(checkinInput, checkinErrorEl, 'Reservations can only be made up to 365 days in advance.');
        }
      }
    }

    // 2. Check-Out Date format & business logic validation
    let checkoutDateObj = null;
    if (!checkoutInput.value) {
      isValid = false;
    } else if (!datePattern.test(checkoutInput.value)) {
      isValid = false;
      setFieldError(checkoutInput, checkoutErrorEl, 'Please enter the date in DD-MM-YYYY format.');
    } else {
      checkoutDateObj = parseDateDDMMYYYY(checkoutInput.value);
      const parts = checkoutInput.value.split('-');
      const year = parseInt(parts[2], 10);
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;

      if (!checkoutDateObj) {
        isValid = false;
        setFieldError(checkoutInput, checkoutErrorEl, 'Please enter a valid date.');
      } else if (parts[2].length !== 4) {
        isValid = false;
        setFieldError(checkoutInput, checkoutErrorEl, 'Please enter a valid 4-digit year.');
      } else if (year < currentYear || year > nextYear + 1) { // checkout can bleed slightly past year
        isValid = false;
        setFieldError(checkoutInput, checkoutErrorEl, 'Reservations can only be made up to 365 days in advance.');
      } else if (checkinDateObj) {
        const timeDiff = checkoutDateObj.getTime() - checkinDateObj.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (diffDays < 1) {
          isValid = false;
          setFieldError(checkoutInput, checkoutErrorEl, 'Check-Out must be at least one day after Check-In.');
        } else if (diffDays > 30) {
          isValid = false;
          setFieldError(checkoutInput, checkoutErrorEl, 'Maximum stay allowed is 30 consecutive nights.');
        }
      }
    }

    // Toggle button state
    if (isValid) {
      btnConfirmBooking.removeAttribute('disabled');
    } else {
      btnConfirmBooking.setAttribute('disabled', 'true');
    }

    return isValid;
  }

  // 2. Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateFormState()) {
        const originalText = btnConfirmBooking.innerHTML;
        btnConfirmBooking.setAttribute('disabled', 'true');
        btnConfirmBooking.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving Summary Details...';

        // Translate DD-MM-YYYY strings to YYYY-MM-DD for session storage storage consistency
        const checkinParts = checkinInput.value.split('-');
        const checkoutParts = checkoutInput.value.split('-');
        const checkinISO = `${checkinParts[2]}-${checkinParts[1]}-${checkinParts[0]}`;
        const checkoutISO = `${checkoutParts[2]}-${checkoutParts[1]}-${checkoutParts[0]}`;
        
        sessionStorage.setItem('search_checkin', checkinISO);
        sessionStorage.setItem('search_checkout', checkoutISO);

        setTimeout(() => {
          btnConfirmBooking.removeAttribute('disabled');
          btnConfirmBooking.innerHTML = originalText;
          window.location.href = 'invoice_summary.html';
        }, 1200);
      }
    });
  }
});
