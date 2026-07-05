document.addEventListener('DOMContentLoaded', () => {
  const selectedOption = sessionStorage.getItem('modify_selected_option') || 'radioOption1';

  // Get UI elements
  const currentTotalEl = document.getElementById('lblCurrentTotal');
  const newTotalEl = document.getElementById('lblNewTotal');
  const diffCard = document.getElementById('diffCardContainer');
  const diffTitle = diffCard ? diffCard.querySelector('strong') : null;
  const diffAmountEl = document.getElementById('lblDiffAmount');
  const diffDesc = document.getElementById('lblDiffDesc');
  const labelMathSymbol = document.querySelector('#lblMathSymbolContainer i');
  const successAlertBanner = document.querySelector('.success-alert-banner');
  const successAlertText = successAlertBanner ? successAlertBanner.querySelector('.small') : null;
  const btnProceedPayment = document.getElementById('btnProceedPayment');

  // Comparison details cards (New Selection values)
  const newRoomTypeEl = document.querySelector('.col-md-5:last-child .comparison-details-card span.text-success.fw-bold');
  const newGuestsEl = document.querySelector('.col-md-5:last-child .comparison-details-card span.text-success.small.fw-bold');
  const newExtrasEl = document.querySelector('.col-md-5:last-child .comparison-details-card span.text-success.small.fw-bold:last-child');

  // Option configurations
  let newTotal = "Rs. 60,000";
  let diffAmount = "Rs. 0";
  let diffType = "none"; // "none" or "refund" or "extra"
  let roomType = "Deluxe King Room";
  let guests = "2 Adults";
  let extras = "Breakfast, Wi-Fi, City View";

  if (selectedOption === 'radioOption1') {
    // Same Room Type, Dates Modified - No difference
    newTotal = "Rs. 60,000";
    diffAmount = "Rs. 0";
    diffType = "none";
    roomType = "Deluxe King Room";
    guests = "2 Adults";
    extras = "Breakfast, Wi-Fi, City View";
  } else if (selectedOption === 'radioOption2') {
    // Upgrade Option - Extra Pay
    newTotal = "Rs. 67,500";
    diffAmount = "Rs. 7,500";
    diffType = "extra";
    roomType = "Family Suite";
    guests = "4 Adults";
    extras = "Breakfast, Wi-Fi, City View, Bathtub";
  } else if (selectedOption === 'radioOption3') {
    // Downgrade Option - Refund
    newTotal = "Rs. 45,000";
    diffAmount = "Rs. 15,000";
    diffType = "refund";
    roomType = "Executive Studio Room";
    guests = "2 Adults";
    extras = "Breakfast, Wi-Fi, Garden View";
  }

  // Update DOM details
  if (newTotalEl) newTotalEl.textContent = newTotal;
  if (newRoomTypeEl) newRoomTypeEl.textContent = roomType;
  if (newGuestsEl) newGuestsEl.textContent = guests;
  if (newExtrasEl) newExtrasEl.textContent = extras;

  if (diffAmountEl) {
    diffAmountEl.textContent = diffAmount;
    if (diffType === 'refund') {
      diffAmountEl.className = "fw-bold text-success font-serif fs-3";
      if (diffTitle) diffTitle.textContent = "Refund Amount";
      if (diffDesc) diffDesc.textContent = "To be credited back to your original payment source";
      if (labelMathSymbol) labelMathSymbol.className = "bi bi-distribute-vertical";
      if (successAlertText) successAlertText.textContent = "Your modification results in a price decrease. A refund of " + diffAmount + " will be credited back to your account.";
      if (successAlertBanner) successAlertBanner.className = "success-alert-banner p-3 d-flex align-items-center gap-3 text-start bg-success-light border-success";
      if (btnProceedPayment) {
        btnProceedPayment.innerHTML = 'Confirm Modification & Refund <i class="bi bi-arrow-right"></i>';
        btnProceedPayment.addEventListener('click', (e) => {
          e.preventDefault();
          window.policyModal.show({
            title: 'Review Booking Modification Policy',
            policyType: 'modification',
            onContinue: () => {
              sessionStorage.setItem('currentBookingPaid', 'true');
              sessionStorage.setItem('currentBookingMethod', 'Wallet / Refund');
              sessionStorage.setItem('modify_refund_applied', 'true');
              sessionStorage.setItem('modify_refund_val', diffAmount);
              window.location.href = 'booking_success.html';
            },
            onBack: () => {
              console.log('User cancelled modification policy check');
            }
          });
        });
      }
    } else if (diffType === 'extra') {
      diffAmountEl.className = "fw-bold text-danger font-serif fs-3";
      if (diffTitle) diffTitle.textContent = "Additional Amount";
      if (diffDesc) diffDesc.textContent = "To be paid";
      if (labelMathSymbol) labelMathSymbol.className = "bi bi-plus-lg";
      if (successAlertText) successAlertText.textContent = "You need to pay an additional amount to confirm your modified booking.";
      if (successAlertBanner) successAlertBanner.className = "success-alert-banner p-3 d-flex align-items-center gap-3 text-start";
      if (btnProceedPayment) {
        btnProceedPayment.innerHTML = 'Proceed to Payment <i class="bi bi-arrow-right"></i>';
        btnProceedPayment.addEventListener('click', (e) => {
          e.preventDefault();
          window.policyModal.show({
            title: 'Review Booking Modification Policy',
            policyType: 'modification',
            onContinue: () => {
              sessionStorage.setItem('modify_refund_applied', 'false');
              window.location.href = 'payment_portal.html';
            },
            onBack: () => {
              console.log('User cancelled modification policy check');
            }
          });
        });
      }
    } else {
      // No price difference (Same room, modified dates)
      diffAmountEl.className = "fw-bold text-dark font-serif fs-3";
      if (diffTitle) diffTitle.textContent = "Balance Difference";
      if (diffDesc) diffDesc.textContent = "No extra charges or refunds required for this modification.";
      if (labelMathSymbol) labelMathSymbol.className = "bi bi-check-all text-success";
      if (successAlertText) successAlertText.textContent = "Your stay modification details are updated. No extra payment or refund is required.";
      if (successAlertBanner) successAlertBanner.className = "success-alert-banner p-3 d-flex align-items-center gap-3 text-start bg-success-light border-success";
      if (btnProceedPayment) {
        btnProceedPayment.innerHTML = 'Confirm Stay Modification <i class="bi bi-arrow-right"></i>';
        btnProceedPayment.addEventListener('click', (e) => {
          e.preventDefault();
          window.policyModal.show({
            title: 'Review Booking Modification Policy',
            policyType: 'modification',
            onContinue: () => {
              sessionStorage.setItem('currentBookingPaid', 'true');
              sessionStorage.setItem('currentBookingMethod', 'Stay Modified (No Charge)');
              sessionStorage.setItem('modify_refund_applied', 'false');
              window.location.href = 'booking_success.html';
            },
            onBack: () => {
              console.log('User cancelled modification policy check');
            }
          });
        });
      }
    }
  }
  // Help & Contact Support Modal setup
  const btnContactSupport = document.getElementById('btnContactSupport');
  if (btnContactSupport) {
    btnContactSupport.addEventListener('click', () => {
      const contactModal = new bootstrap.Modal(document.getElementById('receptionContactModal'));
      contactModal.show();
    });
  }

  // Ringing Call and Email simulation variables
  const phoneBtn = document.getElementById('receptionPhoneBtn');
  const emailBtn = document.getElementById('receptionEmailBtn');
  const callModalEl = document.getElementById('receptionCallModal');
  const callProgressState = document.getElementById('callProgressState');
  const callResultState = document.getElementById('callResultState');
  const callDurationTimer = document.getElementById('callDurationTimer');
  const btnCancelCall = document.getElementById('btnCancelCall');
  const btnCallSendEmail = document.getElementById('btnCallSendEmail');

  let audioCtx = null;
  let ringTimeout1 = null;
  let ringTimeout2 = null;
  let finalSpeechTimeout = null;
  let durationInterval = null;
  let durationSec = 0;
  let isCallActive = false;

  const emailTo = 'support@elegantenclave.com';
  const emailSubject = 'Assistance with Booking Modification';
  const emailBody = 'Hello Support Team,\n\nI need assistance regarding my booking modification...\n\nThank you.';

  function openEmailClient() {
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_self');
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openEmailClient();
    });
  }

  if (btnCallSendEmail) {
    btnCallSendEmail.addEventListener('click', () => {
      const callModal = bootstrap.Modal.getInstance(callModalEl);
      if (callModal) callModal.hide();
      openEmailClient();
    });
  }

  function playRingingTone() {
    if (!isCallActive) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + 1.8);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          osc1.disconnect();
          osc2.disconnect();
          gainNode.disconnect();
          if (audioCtx && audioCtx.state !== 'closed') {
            audioCtx.close();
          }
        } catch (err) {}
      }, 2000);
    } catch (e) {
      console.warn('Audio Context blocked or failed:', e);
    }
  }

  function stopAllCallActivities() {
    isCallActive = false;
    clearInterval(durationInterval);
    clearTimeout(ringTimeout1);
    clearTimeout(ringTimeout2);
    clearTimeout(finalSpeechTimeout);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close();
    }
  }

  if (phoneBtn) {
    phoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const contactModal = bootstrap.Modal.getInstance(document.getElementById('receptionContactModal'));
      if (contactModal) contactModal.hide();

      callProgressState.classList.remove('d-none');
      callResultState.classList.add('d-none');
      callDurationTimer.textContent = 'Duration: 00:00';
      durationSec = 0;
      isCallActive = true;

      const callModal = new bootstrap.Modal(callModalEl);
      callModal.show();

      playRingingTone();
      ringTimeout1 = setTimeout(() => {
        playRingingTone();
      }, 4000);

      durationInterval = setInterval(() => {
        durationSec++;
        const mins = String(Math.floor(durationSec / 60)).padStart(2, '0');
        const secs = String(durationSec % 60).padStart(2, '0');
        callDurationTimer.textContent = `Duration: ${mins}:${secs}`;
      }, 1000);

      ringTimeout2 = setTimeout(() => {
        if (!isCallActive) return;
        clearInterval(durationInterval);
        callProgressState.classList.add('d-none');
        callResultState.classList.remove('d-none');

        const speechMsg = "The support team is currently busy assisting other guests. Please leave a message or send an email.";
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(speechMsg);
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        } else {
          document.getElementById('callResultMsg').textContent = speechMsg;
        }
      }, 8000);
    });
  }

  if (btnCancelCall) {
    btnCancelCall.addEventListener('click', () => {
      stopAllCallActivities();
      const callModal = bootstrap.Modal.getInstance(callModalEl);
      if (callModal) callModal.hide();
    });
  }

  // Cancel events fallback handler
  if (callModalEl) {
    callModalEl.addEventListener('hidden.bs.modal', () => {
      stopAllCallActivities();
    });
  }
});
