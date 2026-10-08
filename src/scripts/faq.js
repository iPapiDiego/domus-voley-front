/**
 * FAQ Accordion Controller
 */
export function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');

          if (otherTrigger && otherContent) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherContent.style.maxHeight = '0px';
            otherContent.classList.add('opacity-0');
            otherContent.classList.remove('opacity-100');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        }
      });

      // Toggle current item
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        content.classList.add('opacity-0');
        content.classList.remove('opacity-100');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.remove('opacity-0');
        content.classList.add('opacity-100');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
