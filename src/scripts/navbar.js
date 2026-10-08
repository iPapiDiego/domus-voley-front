/**
 * Navbar interactions: Sticky header blur on scroll & Mobile drawer toggle
 */
export function initNavbar() {
  const header = document.getElementById('main-header');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  // Sticky header background transition
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('bg-[#05131d]/90', 'backdrop-blur-md', 'border-b', 'border-teal-500/20', 'shadow-lg');
      header.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header.classList.remove('bg-[#05131d]/90', 'backdrop-blur-md', 'border-b', 'border-teal-500/20', 'shadow-lg');
      header.classList.add('bg-transparent', 'border-transparent');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    let isOpen = false;

    const toggleMenu = (open) => {
      isOpen = open !== undefined ? open : !isOpen;
      if (isOpen) {
        mobileMenu.classList.remove('hidden', 'opacity-0', '-translate-y-4');
        mobileMenu.classList.add('flex', 'opacity-100', 'translate-y-0');
        if (menuIconOpen) menuIconOpen.classList.add('hidden');
        if (menuIconClose) menuIconClose.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.add('opacity-0', '-translate-y-4');
        mobileMenu.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => {
          if (!isOpen) mobileMenu.classList.add('hidden');
        }, 200);
        if (menuIconOpen) menuIconOpen.classList.remove('hidden');
        if (menuIconClose) menuIconClose.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };

    menuBtn.addEventListener('click', () => toggleMenu());

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
}
