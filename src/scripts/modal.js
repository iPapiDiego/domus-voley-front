/**
 * Inscription Modal & WhatsApp Direct Action Controller
 */
export function initModal() {
  const modal = document.getElementById('enroll-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalPanel = document.getElementById('modal-panel');
  const closeBtns = document.querySelectorAll('.close-modal-btn');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const form = document.getElementById('enroll-form');
  const categorySelect = document.getElementById('modal-category');

  if (!modal) return;

  const openModal = (categoryName = '') => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (categoryName && categorySelect) {
      // Find matching option
      for (const option of categorySelect.options) {
        if (option.value.toLowerCase().includes(categoryName.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }

    // Small transition delay
    requestAnimationFrame(() => {
      if (modalBackdrop) modalBackdrop.classList.remove('opacity-0');
      if (modalPanel) {
        modalPanel.classList.remove('opacity-0', 'scale-95', 'translate-y-4');
        modalPanel.classList.add('opacity-100', 'scale-100', 'translate-y-0');
      }
    });
  };

  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.classList.add('opacity-0');
    if (modalPanel) {
      modalPanel.classList.add('opacity-0', 'scale-95', 'translate-y-4');
      modalPanel.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    }

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }, 200);
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-category') || '';
      openModal(cat);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Handle Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Handle Form Submission -> WhatsApp Link
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('modal-name');
      const ageInput = document.getElementById('modal-age');
      const categoryInput = document.getElementById('modal-category');
      const timeInput = document.getElementById('modal-shift');
      const messageInput = document.getElementById('modal-notes');

      const name = nameInput ? nameInput.value.trim() : '';
      const age = ageInput ? ageInput.value.trim() : '';
      const category = categoryInput ? categoryInput.value : '';
      const shift = timeInput ? timeInput.value : '';
      const notes = messageInput ? messageInput.value.trim() : '';

      // Formulate WhatsApp message for Domus Voleibol Club (number: +51 979 833 360)
      const phone = '51979833360';
      let text = `¡Hola Domus Voleibol Club! 👋🏐 Quiero solicitar información e inscribirme a la academia.\n\n`;
      text += `👤 *Nombre:* ${name}\n`;
      if (age) text += `🎂 *Edad:* ${age} años\n`;
      text += `🏆 *Categoría de interés:* ${category}\n`;
      if (shift) text += `⏰ *Turno preferido:* ${shift}\n`;
      if (notes) text += `💬 *Comentario / Consulta:* ${notes}\n`;
      text += `\n📍 Vi su página web y quiero confirmar horarios disponibles y matrícula. ¡Gracias!`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Close modal
      closeModal();
      form.reset();
    });
  }
}
