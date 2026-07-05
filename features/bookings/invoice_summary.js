document.addEventListener('DOMContentLoaded', () => {
  // Generate random dummy booking ID format: EE-COB-260625-7852 once per session
  let bookingId = sessionStorage.getItem('currentBookingId');
  if (!bookingId) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    bookingId = `EE-COB-260625-${randomDigits}`;
    sessionStorage.setItem('currentBookingId', bookingId);
  }

  const bookingIdText = document.getElementById('bookingIdText');
  if (bookingIdText) {
    bookingIdText.textContent = bookingId;
  }

  // Trigger loading spinner indicators during Proceed actions
  const btnProceed1 = document.getElementById('btnProceedInvoice1');
  const btnProceed2 = document.getElementById('btnProceedInvoice2');

  function handlePaymentNavigation(button) {
    const originalText = button.innerHTML;
    button.setAttribute('disabled', 'true');
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Initializing Secure Gateway...';

    setTimeout(() => {
      button.removeAttribute('disabled');
      button.innerHTML = originalText;
      window.location.href = 'payment_portal.html';
    }, 1500);
  }

  if (btnProceed1) {
    btnProceed1.addEventListener('click', () => handlePaymentNavigation(btnProceed1));
  }
});
