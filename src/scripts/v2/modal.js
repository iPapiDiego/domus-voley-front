/**
 * Domus Voleibol Club - Enrollment & Trial Class Modal (V2)
 */

export function initModalV2() {
  const modal = document.querySelector('[data-enroll-modal-v2]');
  if (!modal) return;

  const openButtons = document.querySelectorAll('[data-open-enroll-modal]');
  const closeButtons = modal.querySelectorAll('[data-close-enroll-modal]');
  const form = modal.querySelector('[data-enroll-form]');
  const categorySelect = modal.querySelector('[name="categoria"]');

  function openModal(presetCategory) {
    if (presetCategory && categorySelect) {
      categorySelect.value = presetCategory;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Auto-focus first input
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preset = btn.getAttribute('data-preset-category');
      openModal(preset);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Handle Form Submission -> WhatsApp
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('nombre') || '';
      const phone = formData.get('telefono') || '';
      const category = formData.get('categoria') || '';
      const schedule = formData.get('horario') || '';
      const message = formData.get('mensaje') || '';

      const targetPhone = "51979833360";
      const waText = `¡Hola Domus Voley! Quiero solicitar mi CLASE DE EVALUACIÓN GRATIS:\n• Nombre: ${name}\n• Contacto: ${phone}\n• Categoría: ${category}\n• Horario preferido: ${schedule}\n• Comentarios: ${message || 'Deseo conocer la disponibilidad actual.'}\n(Enviado desde Landing V2 Pro)`;

      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }
}
