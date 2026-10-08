/**
 * Domus Voleibol Club - Interactive Trial & Membership Calculator (V2)
 * Harmonized with official Teal & Ocean Navy branding.
 */

export function initCalculator() {
  const calcContainer = document.querySelector('[data-calculator]');
  if (!calcContainer) return;

  const ageButtons = calcContainer.querySelectorAll('[data-calc-age]');
  const freqButtons = calcContainer.querySelectorAll('[data-calc-freq]');
  const levelButtons = calcContainer.querySelectorAll('[data-calc-level]');

  const planTitle = calcContainer.querySelector('[data-plan-title]');
  const planHours = calcContainer.querySelector('[data-plan-hours]');
  const planTag = calcContainer.querySelector('[data-plan-tag]');
  const planCta = calcContainer.querySelector('[data-calc-cta]');

  let selectedAge = 'juvenil'; // 'infantil', 'juvenil', 'adulto'
  let selectedFreq = '3x'; // '2x', '3x', 'weekend'
  let selectedLevel = 'intermedio'; // 'principiante', 'intermedio', 'avanzado'

  const labels = {
    age: {
      infantil: 'Semillero Infantil (6-11 años)',
      juvenil: 'Menores y Juveniles (12-17 años)',
      adulto: 'Mayores y Adultos (18+ años)'
    },
    freq: {
      '2x': '2 sesiones x semana',
      '3x': '3 sesiones x semana',
      'weekend': 'Intensivo Fines de Semana'
    },
    level: {
      principiante: 'Principiante (Desde cero)',
      intermedio: 'Intermedio (Con fundamentos)',
      avanzado: 'Avanzado (Roce competitivo)'
    }
  };

  const hoursMap = {
    '2x': '3 a 4 horas semanales de pista',
    '3x': '5 a 6 horas semanales de pista + preparación física',
    'weekend': '4 horas intensivas sábados y domingos'
  };

  function updateActiveButtonStyles(buttons, activeAttr, activeVal) {
    buttons.forEach(btn => {
      const val = btn.getAttribute(activeAttr);
      const isMatch = val === activeVal;
      if (isMatch) {
        btn.classList.add('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-md', 'shadow-teal-600/30');
        btn.classList.remove('bg-slate-800/90', 'text-slate-300', 'border-slate-700');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-md', 'shadow-teal-600/30');
        btn.classList.add('bg-slate-800/90', 'text-slate-300', 'border-slate-700');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  function recalculate() {
    updateActiveButtonStyles(ageButtons, 'data-calc-age', selectedAge);
    updateActiveButtonStyles(freqButtons, 'data-calc-freq', selectedFreq);
    updateActiveButtonStyles(levelButtons, 'data-calc-level', selectedLevel);

    const titleText = `Programa ${labels.age[selectedAge]} • ${labels.freq[selectedFreq]}`;
    if (planTitle) planTitle.textContent = titleText;
    if (planHours) planHours.textContent = hoursMap[selectedFreq];
    if (planTag) planTag.textContent = `Nivel: ${labels.level[selectedLevel]}`;

    if (planCta) {
      const phone = "51979833360";
      const message = `¡Hola Domus Voleibol Club! Usé el cotizador en la web V2. Quiero reservar mi CLASE DE PRUEBA GRATIS para:\n• Categoría: ${labels.age[selectedAge]}\n• Frecuencia: ${labels.freq[selectedFreq]}\n• Experiencia: ${labels.level[selectedLevel]}\nSede: Teresa González de Fanning (Jesús María). ¿Qué cupo tienen disponible?`;
      planCta.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }
  }

  // Bind age buttons
  ageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedAge = btn.getAttribute('data-calc-age');
      recalculate();
    });
  });

  // Bind freq buttons
  freqButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedFreq = btn.getAttribute('data-calc-freq');
      recalculate();
    });
  });

  // Bind level buttons
  levelButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedLevel = btn.getAttribute('data-calc-level');
      recalculate();
    });
  });

  recalculate();
}
