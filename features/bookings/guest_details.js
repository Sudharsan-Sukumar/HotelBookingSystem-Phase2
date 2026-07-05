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

  // Helper Form State Validator
  function validateFormState() {
    let isValid = true;

    // Reset UI errors
    guestErrorMsg.classList.add('d-none');
    guestErrorMsg.textContent = '';
    dateErrorMsg.classList.add('d-none');
    dateErrorMsg.textContent = '';

    // Guest check - minimum count should not be 0 or negative
    const countVal = parseInt(guestCountInput.value);
    if (!guestCountInput.value || isNaN(countVal) || countVal < 1) {
      isValid = false;
      guestErrorMsg.textContent = 'Guest count must be at least 1.';
      guestErrorMsg.classList.remove('d-none');
    } else if (countVal > 4) {
      isValid = false;
      guestErrorMsg.textContent = 'Guest count exceeds maximum room capacity (Max 4 Guests).';
      guestErrorMsg.classList.remove('d-none');
    }

    // Dates check
    if (!checkinInput.value || !checkoutInput.value) {
      isValid = false;
    } else {
      // Validate Check-in Date from current date/today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Parse dates using date-string representations to avoid timezone offsets
      const checkinParts = checkinInput.value.split('-');
      const checkoutParts = checkoutInput.value.split('-');
      
      const checkinDate = new Date(parseInt(checkinParts[0]), parseInt(checkinParts[1]) - 1, parseInt(checkinParts[2]));
      const checkoutDate = new Date(parseInt(checkoutParts[0]), parseInt(checkoutParts[1]) - 1, parseInt(checkoutParts[2]));

      if (checkinDate < today) {
        isValid = false;
        dateErrorMsg.textContent = 'Stay Check-In Date must be today or a future date.';
        dateErrorMsg.classList.remove('d-none');
      } else {
        // Check-out date must be minimum of 1 day from check-in date
        const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (diffDays < 1) {
          isValid = false;
          dateErrorMsg.textContent = 'Stay Check-Out Date must be at least 1 day after the Check-In Date.';
          dateErrorMsg.classList.remove('d-none');
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
