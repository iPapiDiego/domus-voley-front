/**
 * Domus Voleibol Club - Navbar & Mobile Navigation (V2)
 */

export function initNavbarV2() {
  const header = document.querySelector('[data-navbar-v2]');
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle-v2]');
  const mobileMenu = document.querySelector('[data-mobile-menu-v2]');
  const menuLinks = document.querySelectorAll('[data-nav-link-v2]');

  if (!header) return;

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-[#050b14]/95', 'backdrop-blur-md', 'shadow-xl', 'border-b', 'border-white/10');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-[#050b14]/95', 'backdrop-blur-md', 'shadow-xl', 'border-b', 'border-white/10');
      header.classList.add('bg-transparent');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', (!isExpanded).toString());
      if (isExpanded) {
        mobileMenu.classList.add('hidden');
      } else {
        mobileMenu.classList.remove('hidden');
      }
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}
