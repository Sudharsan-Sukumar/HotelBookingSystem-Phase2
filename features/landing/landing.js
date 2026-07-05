document.addEventListener('DOMContentLoaded', () => {
  // 1. Guests & Rooms Dropdown Controls
  const dropdownTrigger = document.getElementById('guestsRoomsDropdown');
  const guestsRoomsInput = document.getElementById('guestsRoomsInput');
  
  let guestsCount = 2;
  let roomsCount = 1;

  function updateGuestsInput() {
    guestsRoomsInput.value = `${guestsCount} Guest${guestsCount > 1 ? 's' : ''}, ${roomsCount} Room${roomsCount > 1 ? 's' : ''}`;
  }

  // Setup click listeners inside counter rows
  document.querySelectorAll('.btn-counter').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid closing dropdown
      const type = button.dataset.type; // 'guests' or 'rooms'
      const action = button.dataset.action; // 'plus' or 'minus'
      
      if (type === 'guests') {
        if (action === 'plus' && guestsCount < 4) {
          guestsCount++;
        } else if (action === 'minus' && guestsCount > 1) {
          guestsCount--;
        }
        document.getElementById('guestsValue').textContent = guestsCount;
        document.querySelector('[data-type="guests"][data-action="minus"]').disabled = guestsCount <= 1;
        document.querySelector('[data-type="guests"][data-action="plus"]').disabled = guestsCount >= 4;
      } else if (type === 'rooms') {
        if (action === 'plus' && roomsCount < 2) {
          roomsCount++;
        } else if (action === 'minus' && roomsCount > 1) {
          roomsCount--;
        }
        document.getElementById('roomsValue').textContent = roomsCount;
        document.querySelector('[data-type="rooms"][data-action="minus"]').disabled = roomsCount <= 1;
        document.querySelector('[data-type="rooms"][data-action="plus"]').disabled = roomsCount >= 2;
      }
      
      updateGuestsInput();
    });
  });

  // Prevent dropdown from closing when clicking inside it
  const dropdownMenu = document.querySelector('.guests-dropdown-menu');
  if (dropdownMenu) {
    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }



  // 3. Simple Toast Alert on Booking click (Removed default alerts, handled via HTML inline functions instead)

  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        alert('Please login to continue.');
        window.location.href = 'features/authentication/login.html';
        return;
      }

      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      
      // Business Logic verification
      if (!checkin || !checkout) {
        alert('Please select both Check-In and Check-Out dates.');
        return;
      }
      
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check-in must be today or in the future
      if (checkinDate < today) {
        alert('Check-In date must be today or a future date.');
        return;
      }

      // Check-out must be at least 1 day after check-in
      const msDiff = checkoutDate.getTime() - checkinDate.getTime();
      const nightCount = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
      if (nightCount < 1) {
        alert('Check-Out date must be at least 1 night after the Check-In date.');
        return;
      }

      // Max stay limit
      if (nightCount > 30) {
        alert('Maximum stay is limited to 30 consecutive nights.');
        return;
      }

      // Save parameters in sessionStorage for propagation
      sessionStorage.setItem('search_checkin', checkin);
      sessionStorage.setItem('search_checkout', checkout);
      sessionStorage.setItem('search_guests_rooms', guestsRoomsInput.value);

      // Redirect to branch search results page
      window.location.href = 'features/hotels/search_results.html';
    });
  }

  // 5. CMS Content Synchronization
  function syncCMSContent() {
    const heroTitle = localStorage.getItem('cms_hero_title');
    const heroSub = localStorage.getItem('cms_hero_subtitle');
    let heroImg = localStorage.getItem('cms_hero_image');
    if (heroImg) {
      // Strip any wrapping quotes from file selection paths
      heroImg = heroImg.replace(/^["']|["']$/g, '');
      // Format absolute Windows paths correctly for CSS file:/// URLs
      if (heroImg.includes('\\') || /^[A-Za-z]:/.test(heroImg)) {
        let cleanPath = heroImg.replace(/\\/g, '/');
        if (!cleanPath.startsWith('file:///')) {
          // Prepend scheme with drive letter format
          heroImg = 'file:///' + cleanPath;
        } else {
          heroImg = cleanPath;
        }
      }
    }

    const aboutHeading = localStorage.getItem('cms_about_heading');
    const aboutSub = localStorage.getItem('cms_about_sub');

    const footerPhone = localStorage.getItem('cms_footer_phone');
    const footerEmail = localStorage.getItem('cms_footer_email');
    const footerBranches = localStorage.getItem('cms_footer_branches');

    if (heroTitle && document.getElementById('customerHeroTitle')) {
      document.getElementById('customerHeroTitle').textContent = heroTitle;
    }
    if (heroSub && document.getElementById('customerHeroSubtitle')) {
      document.getElementById('customerHeroSubtitle').textContent = heroSub;
    }
    if (heroImg && document.getElementById('customerHeroSection')) {
      document.getElementById('customerHeroSection').style.backgroundImage = `url('${heroImg}')`;
    }

    if (aboutHeading && document.getElementById('customerAboutTitle')) {
      document.getElementById('customerAboutTitle').textContent = aboutHeading;
    }
    if (aboutSub && document.getElementById('customerAboutSubtitle')) {
      document.getElementById('customerAboutSubtitle').textContent = aboutSub;
    }

    if (footerPhone && document.getElementById('customerFooterPhone')) {
      document.getElementById('customerFooterPhone').innerHTML = `<i class="bi bi-telephone"></i> ${footerPhone}`;
    }
    if (footerEmail && document.getElementById('customerFooterEmail')) {
      document.getElementById('customerFooterEmail').innerHTML = `<i class="bi bi-envelope"></i> ${footerEmail}`;
    }
    if (footerBranches && document.getElementById('customerFooterBranches')) {
      document.getElementById('customerFooterBranches').innerHTML = `<i class="bi bi-geo-alt"></i> ${footerBranches}`;
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key.startsWith('cms_')) {
      syncCMSContent();
    }
  });

  syncCMSContent();
});
