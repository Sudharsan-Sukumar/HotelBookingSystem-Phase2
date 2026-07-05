document.addEventListener('DOMContentLoaded', () => {
  const mainGalleryDisplay = document.getElementById('mainGalleryDisplay');
  const thumbnailCards = document.querySelectorAll('.thumbnail-card');
  const btnPrev = document.getElementById('btnPrevImage');
  const btnNext = document.getElementById('btnNextImage');

  let currentGalleryIndex = 0;
  const galleryImages = Array.from(thumbnailCards).map(card => card.dataset.src);

  // 1. Gallery Thumbnail Swapper click
  thumbnailCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentGalleryIndex = index;
      updateActiveGalleryItem();
    });
  });

  // Slider Navigation Arrows
  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      updateActiveGalleryItem();
    });

    btnNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      updateActiveGalleryItem();
    });
  }

  function updateActiveGalleryItem() {
    // Fade display transition
    mainGalleryDisplay.style.opacity = '0.3';
    
    setTimeout(() => {
      mainGalleryDisplay.src = galleryImages[currentGalleryIndex];
      mainGalleryDisplay.style.opacity = '1';
    }, 150);

    thumbnailCards.forEach((card, idx) => {
      if (idx === currentGalleryIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // 2. Book Now CTA click action redirection
  const btnBookNow = document.getElementById('btnBookNowDetails');
  if (btnBookNow) {
    btnBookNow.addEventListener('click', () => {
      window.policyModal.show({
        title: 'Review Room Booking Policies',
        policyType: 'booking',
        onContinue: () => {
          const originalText = btnBookNow.innerHTML;
          btnBookNow.setAttribute('disabled', 'true');
          btnBookNow.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving Selection...';

          setTimeout(() => {
            btnBookNow.removeAttribute('disabled');
            btnBookNow.innerHTML = originalText;
            window.location.href = '../bookings/room_selection.html';
          }, 1000);
        },
        onBack: () => {
          console.log('User cancelled booking policy agreement');
        }
      });
    });
  }
});
