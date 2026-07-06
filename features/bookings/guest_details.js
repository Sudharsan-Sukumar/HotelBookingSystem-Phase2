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

    // Dates check
    const currentYear = new Date().getFullYear();
    const minYear = currentYear;
    const maxYear = currentYear + 5;

    // Reset dates styles
    setFieldError(checkinInput, dateErrorMsg, '');
    setFieldError(checkoutInput, dateErrorMsg, '');

    if (!checkinInput.value || !checkoutInput.value) {
      isValid = false;
    } else {
      const checkinParts = checkinInput.value.split('-');
      const checkoutParts = checkoutInput.value.split('-');
      
      const checkinYear = parseInt(checkinParts[0]);
      const checkoutYear = parseInt(checkoutParts[0]);

      // Year must be exactly 4 digits validation rule
      if (checkinParts[0].length !== 4) {
        isValid = false;
        setFieldError(checkinInput, dateErrorMsg, 'Please enter a valid 4-digit year.');
      } else if (checkoutParts[0].length !== 4) {
        isValid = false;
        setFieldError(checkoutInput, dateErrorMsg, 'Please enter a valid 4-digit year.');
      }
      // Year range validation rule
      else if (checkinYear < minYear || checkinYear > maxYear) {
        isValid = false;
        setFieldError(checkinInput, dateErrorMsg, `Booking year must be between ${minYear} and ${maxYear}.`);
      } else if (checkoutYear < minYear || checkoutYear > maxYear) {
        isValid = false;
        setFieldError(checkoutInput, dateErrorMsg, `Booking year must be between ${minYear} and ${maxYear}.`);
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkinDate = new Date(checkinYear, parseInt(checkinParts[1]) - 1, parseInt(checkinParts[2]));
        const checkoutDate = new Date(checkoutYear, parseInt(checkoutParts[1]) - 1, parseInt(checkoutParts[2]));

        // Check-in in the past check
        if (checkinDate < today) {
          isValid = false;
          setFieldError(checkinInput, dateErrorMsg, 'Check-In date cannot be earlier than today.');
        } 
        // Check-out must be after check-in check
        else {
          const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
          const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          if (diffDays < 1) {
            isValid = false;
            setFieldError(checkoutInput, dateErrorMsg, 'Check-Out date must be at least one day after Check-In.');
          } 
          // Stay limit validation rule (Max 30 nights)
          else if (diffDays > 30) {
            isValid = false;
            setFieldError(checkoutInput, dateErrorMsg, 'Maximum stay allowed is 30 nights.');
          }
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

        setTimeout(() => {
          btnConfirmBooking.removeAttribute('disabled');
          btnConfirmBooking.innerHTML = originalText;
          window.location.href = 'invoice_summary.html';
        }, 1200);
      }
    });
  }
});
