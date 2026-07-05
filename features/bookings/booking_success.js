document.addEventListener('DOMContentLoaded', () => {
  // Prevent direct access to this page without a completed payment booking session check
  const hasPaid = sessionStorage.getItem('currentBookingPaid');
  if (!hasPaid) {
    window.location.href = '../../index.html';
    return;
  }

  // Populate transaction payment fields dynamically
  const payMethodText = document.getElementById('payMethodText');
  const txnIdText = document.getElementById('txnIdText');
  const bookingRefText = document.getElementById('bookingRefText');
  const totalAmountEl = document.querySelector('.payment-summary-block span.text-success.font-serif');
  const paymentStatusBadge = document.querySelector('.payment-summary-block span.badge');
  const paymentStatusTitle = document.querySelector('.payment-summary-block li:nth-child(3) span:first-child');
  const primaryTitleEl = document.querySelector('.success-card-body h2');
  const primaryDescEl = document.querySelector('.success-card-body p');

  const storedMethod = sessionStorage.getItem('currentBookingMethod');
  const storedTxnId = sessionStorage.getItem('currentBookingTxnId');
  const storedRef = sessionStorage.getItem('currentBookingRef');
  const isRefundApplied = sessionStorage.getItem('modify_refund_applied') === 'true';
  const refundVal = sessionStorage.getItem('modify_refund_val') || 'Rs. 10,000';

  if (payMethodText && storedMethod) payMethodText.textContent = storedMethod;
  if (txnIdText && storedTxnId) txnIdText.textContent = storedTxnId;
  if (bookingRefText && storedRef) bookingRefText.textContent = storedRef;

  // Handle dynamic text outputs for refund status professional messages
  if (isRefundApplied) {
    if (totalAmountEl) totalAmountEl.textContent = refundVal;
    if (paymentStatusTitle) paymentStatusTitle.textContent = "Credit Status";
    if (paymentStatusBadge) {
      paymentStatusBadge.textContent = "Refund Processed";
      paymentStatusBadge.className = "badge bg-success-light text-success fw-bold py-1 px-3 rounded-pill";
    }
    if (primaryTitleEl) primaryTitleEl.textContent = "Stay Modified & Refund Initiated!";
    if (primaryDescEl) {
      primaryDescEl.innerHTML = "Your stay details have been modified successfully. A refund credit of <strong>" + refundVal + "</strong> has been initiated and will reflect in your account within 3–5 business days.";
    }
  }

  // Actions click bindings
  const btnViewLog = document.getElementById('btnViewLog');
  const btnReturnDashboard = document.getElementById('btnReturnDashboard');

  if (btnViewLog) {
    btnViewLog.addEventListener('click', () => {
      // Clear payment tokens
      sessionStorage.removeItem('currentBookingPaid');
      sessionStorage.removeItem('modify_refund_applied');
      sessionStorage.removeItem('modify_refund_val');
      window.location.href = 'my_bookings.html';
    });
  }

  if (btnReturnDashboard) {
    btnReturnDashboard.addEventListener('click', () => {
      // Clear payment tokens
      sessionStorage.removeItem('currentBookingPaid');
      sessionStorage.removeItem('modify_refund_applied');
      sessionStorage.removeItem('modify_refund_val');
      window.location.href = '../../index.html';
    });
  }
});
