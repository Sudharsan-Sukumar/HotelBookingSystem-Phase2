document.addEventListener('DOMContentLoaded', () => {
  const selectRoomButtons = document.querySelectorAll('.btn-select-room');
  const btnBookNowSubmit = document.getElementById('btnBookNowSubmit');
  const roomCards = document.querySelectorAll('.room-card');

  let selectedRoomId = null;

  // Predefined image sets for each room to support interactive carousel transitions
  const roomImagesData = {
    studio: [
      { src: '../../assets/images/exec_studio_room.png', tag: 'Bedroom', alt: 'Executive Studio Bedroom view' },
      { src: '../../assets/images/exec_studio_balcony.png', tag: 'Balcony View', alt: 'Executive Studio Balcony view' },
      { src: '../../assets/images/exec_studio_bathroom.png', tag: 'Bathroom', alt: 'Executive Studio Bathroom preview' }
    ],
    penthouse: [
      { src: '../../assets/images/Penthouse_room.png', tag: 'Bedroom', alt: 'Penthouse Ocean Suite Bedroom view' },
      { src: '../../assets/images/Penthouse_balcony.png', tag: 'Private balcony', alt: 'Penthouse Ocean Suite balcony view' },
      { src: '../../assets/images/Penthouse_bathroom.png', tag: 'Bathroom', alt: 'Penthouse Ocean Suite bathroom preview' }
    ]
  };

  // Gallery Navigation Logic
  roomCards.forEach(card => {
    const btnSelect = card.querySelector('.btn-select-room');
    if (!btnSelect) return;
    
    const roomId = btnSelect.dataset.roomId;
    const images = roomImagesData[roomId];
    if (!images) return;

    let offsetIndex = 0; // Current offset inside the array
    
    const leftArrow = card.querySelector('.left-slide');
    const rightArrow = card.querySelector('.right-slide');
    
    const imgCol1 = card.querySelectorAll('.gallery-img-card img')[0];
    const tagCol1 = card.querySelectorAll('.gallery-tag')[0];
    
    const imgCol2 = card.querySelectorAll('.gallery-img-card img')[1];
    const tagCol2 = card.querySelectorAll('.gallery-tag')[1];

    function updateCardGallery() {
      // Index math to rotate through the array values
      const item1 = images[offsetIndex % images.length];
      const item2 = images[(offsetIndex + 1) % images.length];

      if (imgCol1 && tagCol1) {
        imgCol1.src = item1.src;
        imgCol1.alt = item1.alt;
        tagCol1.textContent = item1.tag;
      }

      if (imgCol2 && tagCol2) {
        imgCol2.src = item2.src;
        imgCol2.alt = item2.alt;
        tagCol2.textContent = item2.tag;
      }
    }

    if (leftArrow && rightArrow) {
      leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        offsetIndex = (offsetIndex - 1 + images.length) % images.length;
        updateCardGallery();
      });

      rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        offsetIndex = (offsetIndex + 1) % images.length;
        updateCardGallery();
      });
    }
  });

  // Select Room Button Handler logic
  selectRoomButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const roomId = button.dataset.roomId;
      const targetCard = button.closest('.room-card');

      if (selectedRoomId === roomId) {
        // Toggle Deselect
        selectedRoomId = null;
        button.classList.remove('selected');
        button.innerHTML = 'Select Room <i class="bi bi-arrow-right ms-1"></i>';
        targetCard.classList.remove('active-selected');
      } else {
        // Clear previous selections
        selectRoomButtons.forEach(btn => {
          btn.classList.remove('selected');
          btn.innerHTML = 'Select Room <i class="bi bi-arrow-right ms-1"></i>';
        });
        roomCards.forEach(card => card.classList.remove('active-selected'));

        // Highlight selected
        selectedRoomId = roomId;
        button.classList.add('selected');
        button.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Selected';
        targetCard.classList.add('active-selected');
      }
 
      // Instantly trigger redirection to guest details on select click
      if (selectedRoomId) {
        button.setAttribute('disabled', 'true');
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
        setTimeout(() => {
          window.location.href = 'guest_details.html';
        }, 800);
      }
    });
  });



  // 4. Handle pre-selected room category from featured cards
  const preSelectedRoom = sessionStorage.getItem('selected_room_name');
  if (preSelectedRoom) {
    const targetButton = document.querySelector(`.btn-select-room[data-room-id="${preSelectedRoom}"]`);
    if (targetButton) {
      targetButton.click();
      // Optionally scroll it into view
      targetButton.closest('.room-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Clear selection so it doesn't run again on reload
    sessionStorage.removeItem('selected_room_name');
  }
});
