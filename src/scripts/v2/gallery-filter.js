/**
 * Domus Voleibol Club - Gallery Filter & Action Lightbox (V2)
 * Harmonized with official Teal & Ocean Navy branding.
 */

export function initGalleryV2() {
  const gallery = document.querySelector('[data-gallery-v2]');
  if (!gallery) return;

  const filterTabs = gallery.querySelectorAll('[data-gallery-filter]');
  const items = gallery.querySelectorAll('[data-gallery-category]');
  const lightbox = document.querySelector('[data-v2-lightbox]');
  const lightboxImg = lightbox ? lightbox.querySelector('[data-v2-lightbox-img]') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('[data-v2-lightbox-title]') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('[data-v2-lightbox-close]') : null;

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = tab.getAttribute('data-gallery-filter');

      // Update button styling
      filterTabs.forEach(t => {
        const isMatch = t.getAttribute('data-gallery-filter') === cat;
        if (isMatch) {
          t.classList.add('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-md', 'shadow-teal-600/30');
          t.classList.remove('bg-slate-800/80', 'text-slate-300', 'border-slate-700');
          t.setAttribute('aria-selected', 'true');
        } else {
          t.classList.remove('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-md', 'shadow-teal-600/30');
          t.classList.add('bg-slate-800/80', 'text-slate-300', 'border-slate-700');
          t.setAttribute('aria-selected', 'false');
        }
      });

      // Show/hide gallery items
      items.forEach(item => {
        const itemCat = item.getAttribute('data-gallery-category');
        if (cat === 'all' || itemCat === cat) {
          item.classList.remove('hidden');
          item.classList.add('animate-fadeIn');
        } else {
          item.classList.add('hidden');
          item.classList.remove('animate-fadeIn');
        }
      });
    });
  });

  // Lightbox opening
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('[data-item-title]');
      if (!lightbox || !img) return;

      if (lightboxImg) lightboxImg.src = img.src;
      if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;

      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  // Lightbox close function
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}
