document.addEventListener('DOMContentLoaded', () => {
  const radioOption1 = document.getElementById('radioOption1');
  const radioOption2 = document.getElementById('radioOption2');
  const radioOption3 = document.getElementById('radioOption3');
  
  const cardOption1 = document.getElementById('cardOption1Container');
  const cardOption2 = document.getElementById('cardOption2Container');
  const cardOption3 = document.getElementById('cardOption3Container');

  const lblNewAmount = document.getElementById('lblNewAmount');
  const lblDiffAmount = document.getElementById('lblDiffAmount');
  const labelMathSymbol = document.querySelector('.comp-math-symbol i');
  const diffCard = document.querySelector('.bg-light-ivory');
  const diffTitle = diffCard ? diffCard.querySelector('strong') : null;
  const diffDesc = diffCard ? diffCard.querySelector('.small') : null;
  const btnContinueConfirmation = document.getElementById('btnContinueConfirmation');

  // Option 1 pricing parameters (Same Room Type, Dates Modified - No difference)
  const opt1Total = "Rs. 60,000";
  const opt1Diff = "Rs. 0"; // No difference

  // Option 2 pricing parameters (Upgrade - Additional Payment)
  const opt2Total = "Rs. 67,500";
  const opt2Diff = "Rs. 7,500"; // Extra Pay

  // Option 3 pricing parameters (Downgrade - Refund)
  const opt3Total = "Rs. 45,000";
  const opt3Diff = "Rs. 15,000"; // Refund

  function handleSelection(selectedCard, otherCards, totalVal, diffVal, diffType) {
    selectedCard.classList.add('active');
    otherCards.forEach(c => c.classList.remove('active'));
    
    if (lblNewAmount) lblNewAmount.textContent = totalVal;
    if (lblDiffAmount) {
      lblDiffAmount.textContent = diffVal;
      
      // Update typography, icon, and colors for professional visual cues
      if (diffType === 'refund') {
        lblDiffAmount.className = "fw-bold text-success font-serif fs-3";
        if (diffTitle) diffTitle.textContent = "Refund Amount";
        if (diffDesc) diffDesc.textContent = "To be credited back to your wallet / original payment source";
        if (labelMathSymbol) {
          labelMathSymbol.className = "bi bi-distribute-vertical";
        }
      } else if (diffType === 'extra') {
        lblDiffAmount.className = "fw-bold text-danger font-serif fs-3";
        if (diffTitle) diffTitle.textContent = "Additional Amount";
        if (diffDesc) diffDesc.textContent = "To be paid";
        if (labelMathSymbol) {
          labelMathSymbol.className = "bi bi-plus-lg";
        }
      } else {
        // No difference
        lblDiffAmount.className = "fw-bold text-dark font-serif fs-3";
        if (diffTitle) diffTitle.textContent = "Balance Difference";
        if (diffDesc) diffDesc.textContent = "No extra charges or refunds required";
        if (labelMathSymbol) {
          labelMathSymbol.className = "bi bi-check-all text-success";
        }
      }
    }
  }

  if (radioOption1) {
    radioOption1.addEventListener('change', () => {
      if (radioOption1.checked) {
        handleSelection(cardOption1, [cardOption2, cardOption3], opt1Total, opt1Diff, 'none');
      }
    });
  }

  if (radioOption2) {
    radioOption2.addEventListener('change', () => {
      if (radioOption2.checked) {
        handleSelection(cardOption2, [cardOption1, cardOption3], opt2Total, opt2Diff, 'extra');
      }
    });
  }

  if (radioOption3) {
    radioOption3.addEventListener('change', () => {
      if (radioOption3.checked) {
        handleSelection(cardOption3, [cardOption1, cardOption2], opt3Total, opt3Diff, 'refund');
      }
    });
  }

  // Submit trigger redirection
  if (btnContinueConfirmation) {
    btnContinueConfirmation.addEventListener('click', () => {
      // Store checkout option choice to dictate payment vs refund success state messaging
      const selectedOption = document.querySelector('input[name="optionSelectRadio"]:checked').id;
      sessionStorage.setItem('modify_selected_option', selectedOption);
      window.location.href = 'modify_booking_step3.html';
    });
  }
});
