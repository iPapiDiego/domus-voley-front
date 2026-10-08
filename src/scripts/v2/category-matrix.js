/**
 * Domus Voleibol Club - Category Matrix & Live Vacancy Controller (V2)
 * Harmonized with official Teal & Ocean Navy branding.
 */

export function initCategoryMatrix() {
  const matrixContainer = document.querySelector('[data-category-matrix]');
  if (!matrixContainer) return;

  const tabs = matrixContainer.querySelectorAll('[data-cat-tab]');
  const panels = matrixContainer.querySelectorAll('[data-cat-panel]');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCat = tab.getAttribute('data-cat-tab');

      // Update tabs
      tabs.forEach(t => {
        const isActive = t.getAttribute('data-cat-tab') === targetCat;
        if (isActive) {
          t.classList.add('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-lg', 'shadow-teal-600/30');
          t.classList.remove('bg-slate-900/90', 'text-slate-300', 'border-slate-800');
          t.setAttribute('aria-selected', 'true');
        } else {
          t.classList.remove('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-lg', 'shadow-teal-600/30');
          t.classList.add('bg-slate-900/90', 'text-slate-300', 'border-slate-800');
          t.setAttribute('aria-selected', 'false');
        }
      });

      // Update panels
      panels.forEach(p => {
        const isMatch = p.getAttribute('data-cat-panel') === targetCat;
        if (isMatch) {
          p.classList.remove('hidden');
          p.classList.add('animate-fadeIn');
        } else {
          p.classList.add('hidden');
          p.classList.remove('animate-fadeIn');
        }
      });
    });
  });
}
