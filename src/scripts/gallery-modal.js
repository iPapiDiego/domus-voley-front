/**
 * Sports Photo Lightbox Controller
 */
export function initGalleryModal() {
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('[data-gallery-photo]');

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (src, title, sub) => {
    lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Domus Voleibol Club';
    if (lightboxSub) lightboxSub.textContent = sub || 'Jesús María, Lima';

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      lightbox.classList.remove('opacity-0');
      lightbox.classList.add('opacity-100');
    });
  };

  const closeLightbox = () => {
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');

    setTimeout(() => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 250);
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-img-src') || '';
      const title = btn.getAttribute('data-img-title') || '';
      const sub = btn.getAttribute('data-img-sub') || '';
      if (src) openLightbox(src, title, sub);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox-backdrop') {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}
