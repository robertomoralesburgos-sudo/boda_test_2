// Starter: carousel horizontal + dots + modal RSVP + lightbox + preview-only form
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = document.getElementById('dots');

  // Build dots
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Ir a sección ${i+1}`);
    b.addEventListener('click', () => {
      s.scrollIntoView({behavior:'smooth', inline:'center'});
      setActiveDot(i);
      s.focus();
    });
    dots.appendChild(b);
  });

  function setActiveDot(index){
    const btns = Array.from(dots.children);
    btns.forEach((b, i) => {
      if(i===index) b.setAttribute('aria-current','true');
      else b.removeAttribute('aria-current');
    });
  }

  // Update dot on scroll (throttled using requestAnimationFrame)
  let ticking = false;
  carousel.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const center = carousel.scrollLeft + carousel.clientWidth / 2;
        let best = 0; let minDist = Infinity;
        slides.forEach((s, idx) => {
          const rect = s.getBoundingClientRect();
          const sCenter = rect.left + rect.width/2 + carousel.scrollLeft - carousel.getBoundingClientRect().left;
          const dist = Math.abs(sCenter - center);
          if (dist < minDist) { minDist = dist; best = idx; }
        });
        setActiveDot(best);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial dot
  setActiveDot(0);

  // RSVP modal controls
  const openRsvp = document.getElementById('open-rsvp');
  const rsvpModal = document.getElementById('rsvp-modal');
  const closeRsvp = document.getElementById('close-rsvp');
  const rCancel = document.getElementById('r-cancel');
  const rForm = document.getElementById('rsvp-form');
  const rStatus = document.getElementById('r-status');

  function showModal() {
    rsvpModal.setAttribute('aria-hidden','false');
    // trap focus: focus first input
    setTimeout(()=> document.getElementById('r-name')?.focus(), 180);
  }
  function hideModal() {
    rsvpModal.setAttribute('aria-hidden','true');
    openRsvp?.focus();
  }

  openRsvp?.addEventListener('click', (e) => { e.preventDefault(); showModal(); });
  closeRsvp?.addEventListener('click', hideModal);
  rCancel?.addEventListener('click', hideModal);

  // Close modal with ESC
  document.addEventListener('keydown', (ev) => {
    if(ev.key === 'Escape' && rsvpModal.getAttribute('aria-hidden') === 'false') hideModal();
  });

  // Form submit (preview-only)
  rForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    rStatus.hidden = true;
    const name = rForm.name.value.trim();
    if (!name) {
      rStatus.textContent = 'Por favor indica tu nombre.';
      rStatus.hidden = false;
      return;
    }
    // Show small confirmation then close
    rStatus.textContent = 'Gracias — confirmación en modo vista previa.';
    rStatus.hidden = false;
    rForm.reset();
    setTimeout(hideModal, 1200);
  });

  // Lightbox for gallery
  const photos = Array.from(document.querySelectorAll('.photos img'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');

  photos.forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lightbox.setAttribute('aria-hidden','false');
      lbClose?.focus();
    });
  });

  lbClose?.addEventListener('click', () => {
    lightbox.setAttribute('aria-hidden','true');
  });

  // Close lightbox on ESC or click outside
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
      lightbox.setAttribute('aria-hidden','true');
    }
  });
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.setAttribute('aria-hidden','true');
  });

  // Keyboard left/right navigation between slides
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      ev.preventDefault();
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let current = 0; let minDist = Infinity;
      slides.forEach((s, idx) => {
        const rect = s.getBoundingClientRect();
        const sCenter = rect.left + rect.width/2 + carousel.scrollLeft - carousel.getBoundingClientRect().left;
        const dist = Math.abs(sCenter - center);
        if (dist < minDist) { minDist = dist; current = idx; }
      });
      if (ev.key === 'ArrowRight' && current < slides.length - 1) current++;
      if (ev.key === 'ArrowLeft' && current > 0) current--;
      slides[current].scrollIntoView({behavior:'smooth', inline:'center'});
      slides[current].focus();
      setActiveDot(current);
    }
  });
});
