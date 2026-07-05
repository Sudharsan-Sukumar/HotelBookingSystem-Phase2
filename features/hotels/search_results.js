document.addEventListener('DOMContentLoaded', () => {
  // Elements Selection
  const filterForm = document.getElementById('filterForm');
  const locationSelect = document.getElementById('filterLocation');
  const checkinInput = document.getElementById('filterCheckIn');
  const checkoutInput = document.getElementById('filterCheckOut');
  const maxPriceInput = document.getElementById('filterMaxPrice');
  const hotelListings = document.getElementById('hotelListingsContainer');
  const noResultsState = document.getElementById('noResultsState');
  const btnReset = document.getElementById('btnResetFilters');

  // 2. Filter list logic execution
  function applySelectedFilters() {
    const selectedLocation = locationSelect.value; // 'Salem', 'Coimbatore', 'Chennai', 'All'
    const maxPriceValue = parseFloat(maxPriceInput.value.replace(/[^0-9.]/g, '')) || Infinity;
    
    // Get checked room checkboxes
    const checkedTypes = [];
    document.querySelectorAll('.filter-checkbox:checked').forEach(cb => {
      checkedTypes.push(cb.value);
    });

    const hotelCards = document.querySelectorAll('.hotel-card');
    let matchesCount = 0;

    hotelCards.forEach(card => {
      const cardLocation = card.dataset.location;
      const cardPrice = parseFloat(card.dataset.price);
      const cardTypes = card.dataset.types;

      let isMatch = true;

      // Location Filter check
      if (selectedLocation !== 'All' && cardLocation !== selectedLocation) {
        isMatch = false;
      }

      // Budget price check
      if (cardPrice > maxPriceValue) {
        isMatch = false;
      }

      // Room Type checks
      if (checkedTypes.length > 0 && !checkedTypes.includes(cardTypes)) {
        isMatch = false;
      }

      // Render Toggle state
      if (isMatch) {
        card.classList.remove('d-none');
        matchesCount++;
      } else {
        card.classList.add('d-none');
      }
    });

    // Toggle Empty state container block
    if (matchesCount === 0) {
      hotelListings.classList.add('d-none');
      noResultsState.classList.remove('d-none');
    } else {
      hotelListings.classList.remove('d-none');
      noResultsState.classList.add('d-none');
    }
  }

  // Bind Submit handler to Filter Panel Form
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform simple check-out date verification
      if (checkinInput.value && checkoutInput.value) {
        const checkinDate = new Date(checkinInput.value);
        const checkoutDate = new Date(checkoutInput.value);
        const dateErrorMsg = document.getElementById('dateErrorMsg');

        if (checkoutDate <= checkinDate) {
          dateErrorMsg.classList.remove('d-none');
          return;
        } else {
          dateErrorMsg.classList.add('d-none');
        }
      }

      // Show brief simulation loading spinner
      const submitBtn = filterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Fetching...';

      setTimeout(() => {
        submitBtn.removeAttribute('disabled');
        submitBtn.innerHTML = originalText;
        applySelectedFilters();
      }, 800);
    });
  }

  // 3. Reset Filters handler
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      locationSelect.value = 'All';
      checkinInput.value = '';
      checkoutInput.value = '';
      maxPriceInput.value = '';
      document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
      applySelectedFilters();
    });
  }

  // Details redirection mock
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'hotel_details.html';
    });
  });
});
