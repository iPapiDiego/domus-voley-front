/**
 * Domus Voleibol Club - Tactical Court Board Controller (V2)
 * Manages 2.5D interactive volleyball court, position selection, and tactical HUD radar.
 * Colors harmonized with official Domus Teal (#109b8b) & Ocean Navy (#0b496d) branding.
 */

const POSITIONS_DATA = {
  punta: {
    name: "Punta Receptor",
    zone: "Zona 4 (Ataque y Recepción)",
    badge: "Ofensiva & Pase",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    slogan: "Potencia de remate letal y temple para recibir el saque rival bajo presión.",
    stats: { attack: 95, jump: 92, defense: 88, vision: 85 },
    netHeight: "2.43m (M) / 2.24m (F)",
    trainingFocus: "Ataque cruzado y a la línea, recepción de saques flotantes y con salto potente, transición inmediata de bloqueo a ataque.",
    drills: ["Transición 4-4 en contragolpe", "Pase a zona de armado bajo saque fuerte", "Ataque contra bloqueo doble"],
    ctaMessage: "Hola Domus Voley, vi la Pizarra Táctica y quiero entrenar en la posición de Punta Receptor. ¿Qué horarios tienen disponibles?"
  },
  armador: {
    name: "Armador / Pasador",
    zone: "Zona 2/3 (Distribuidor Estratégico)",
    badge: "Cerebro Táctico",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    slogan: "El director de orquesta que engaña al bloqueo contrario y coloca el balón milimétrico.",
    stats: { attack: 72, jump: 84, defense: 86, vision: 98 },
    netHeight: "Distribución en salto reglamentario",
    trainingFocus: "Biomecánica del toque de dedos, colocación en salto, lectura periférica de bloqueadores rivales y ritmo del juego.",
    drills: ["Pases rápidos de primer y segundo tiempo", "Colocación de espaldas hacia zona 2", "Defensa y armado de emergencia"],
    ctaMessage: "Hola Domus Voley, me apasiona la posición de Armador / Pasador. Quiero mejorar mi técnica táctica en la academia."
  },
  central: {
    name: "Central (Bloqueador)",
    zone: "Zona 3 (Muro Defensivo & 1er Tiempo)",
    badge: "Muralla de Red",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    slogan: "Muro infranqueable en la red y remates relámpago que sorprenden a la defensa rival.",
    stats: { attack: 92, jump: 96, defense: 76, vision: 91 },
    netHeight: "2.43m (M) / 2.24m (F) - Foco en invasión aérea",
    trainingFocus: "Desplazamiento lateral rápido, lectura de las manos del armador rival, invasión aérea sin tocar la red y ataque al primer tiempo.",
    drills: ["Lectura y cierre de bloqueo doble", "Ataque rápido coja / primer tiempo", "Pliometría y amortiguación de caída"],
    ctaMessage: "Hola Domus Voley, quiero entrenar como Central / Bloqueador para potenciar mi salto y bloqueo."
  },
  opuesto: {
    name: "Opuesto (Cañonero)",
    zone: "Zona 1/2 (Ataque Zaguero & Potencia)",
    badge: "Máximo Anotador",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    slogan: "El artillero del equipo, letal tanto en la red como rematando balones zagueros.",
    stats: { attack: 98, jump: 95, defense: 80, vision: 87 },
    netHeight: "2.43m (M) / 2.24m (F)",
    trainingFocus: "Ataque desde la zaga (Pipe y zona 1), resolución de balones separados y difíciles, saque potente en salto.",
    drills: ["Ataque zaguero tras recepción difícil", "Saque con salto a zonas vulnerables", "Bloqueo uno contra uno al punta rival"],
    ctaMessage: "Hola Domus Voley, busco perfeccionarme como Opuesto. ¿Tienen entrenamientos avanzados de potencia de ataque?"
  },
  libero: {
    name: "Líbero (Defensa)",
    zone: "Zaga (Zonas 5, 6 y 1)",
    badge: "Guardián del Suelo",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    slogan: "Reflejos felinos, camiseta diferenciada y el corazón que no deja caer ningún balón.",
    stats: { attack: 45, jump: 78, defense: 99, vision: 96 },
    netHeight: "Juego rasante y defensivo en suelo",
    trainingFocus: "Planchas defensivas, amortiguación de remates a más de 100 km/h, pase perfecto al armador y cobertura de bloqueadores.",
    drills: ["Recepción de remates en ángulo agudo", "Planchas y rodadas de recuperación", "Segundo pase de emergencia con dedos"],
    ctaMessage: "Hola Domus Voley, mi vocación es ser Líbero. Quiero entrenar defensa acrobática y recepción de élite."
  },
  semillero: {
    name: "Iniciación y Semillero",
    zone: "Formación Integral Multizona",
    badge: "Bases & Técnica",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    slogan: "El punto de partida donde aprendes los 6 fundamentos y te enamoras de la disciplina del vóley.",
    stats: { attack: 75, jump: 75, defense: 85, vision: 85 },
    netHeight: "Adaptada progresivamente por categoría",
    trainingFocus: "Postura básica atlética, voleo de precisión, golpe de antebrazos, saque bajo mano, desplazamiento y trabajo en equipo.",
    drills: ["Circuitos de coordinación motriz y salto", "Juegos de control de balón por parejas", "Simulacros de rotación en cancha"],
    ctaMessage: "Hola Domus Voley, quiero inscribirme (o inscribir a mi hijo/a) en el Semillero formativo para aprender desde cero."
  }
};

export function initTacticalBoard() {
  const courtContainer = document.querySelector('[data-tactical-court]');
  if (!courtContainer) return;

  const nodeButtons = courtContainer.querySelectorAll('[data-position-key]');
  const tabButtons = document.querySelectorAll('[data-pos-tab]');
  const hudName = document.querySelector('[data-hud-name]');
  const hudZone = document.querySelector('[data-hud-zone]');
  const hudBadge = document.querySelector('[data-hud-badge]');
  const hudSlogan = document.querySelector('[data-hud-slogan]');
  const hudNet = document.querySelector('[data-hud-net]');
  const hudFocus = document.querySelector('[data-hud-focus]');
  const hudDrillsList = document.querySelector('[data-hud-drills]');
  const hudCta = document.querySelector('[data-hud-cta]');

  const statAttack = document.querySelector('[data-stat-attack]');
  const statJump = document.querySelector('[data-stat-jump]');
  const statDefense = document.querySelector('[data-stat-defense]');
  const statVision = document.querySelector('[data-stat-vision]');

  const statAttackNum = document.querySelector('[data-stat-attack-num]');
  const statJumpNum = document.querySelector('[data-stat-jump-num]');
  const statDefenseNum = document.querySelector('[data-stat-defense-num]');
  const statVisionNum = document.querySelector('[data-stat-vision-num]');

  function selectPosition(key) {
    const data = POSITIONS_DATA[key];
    if (!data) return;

    // Update Court Nodes visual active state
    nodeButtons.forEach(btn => {
      const isCurrent = btn.getAttribute('data-position-key') === key;
      if (isCurrent) {
        btn.classList.add('ring-4', 'ring-teal-400', 'scale-110', 'bg-teal-600', 'shadow-lg', 'shadow-teal-500/50');
        btn.classList.remove('bg-slate-800', 'border-slate-600', 'opacity-85');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('ring-4', 'ring-teal-400', 'scale-110', 'bg-teal-600', 'shadow-lg', 'shadow-teal-500/50');
        btn.classList.add('bg-slate-800', 'border-slate-600', 'opacity-85');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Update position pills tabs
    tabButtons.forEach(tab => {
      const isCurrent = tab.getAttribute('data-pos-tab') === key;
      if (isCurrent) {
        tab.classList.add('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-md', 'shadow-teal-600/40');
        tab.classList.remove('bg-slate-900/80', 'text-slate-300', 'border-slate-700');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('bg-teal-600', 'text-white', 'border-teal-400', 'shadow-md', 'shadow-teal-600/40');
        tab.classList.add('bg-slate-900/80', 'text-slate-300', 'border-slate-700');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update HUD text details
    if (hudName) hudName.textContent = data.name;
    if (hudZone) hudZone.textContent = data.zone;
    if (hudBadge) {
      hudBadge.textContent = data.badge;
      hudBadge.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${data.badgeColor}`;
    }
    if (hudSlogan) hudSlogan.textContent = `"${data.slogan}"`;
    if (hudNet) hudNet.textContent = data.netHeight;
    if (hudFocus) hudFocus.textContent = data.trainingFocus;

    // Update Drills list
    if (hudDrillsList) {
      hudDrillsList.innerHTML = '';
      data.drills.forEach(drill => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2 text-sm text-slate-300';
        li.innerHTML = `
          <svg class="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>${drill}</span>
        `;
        hudDrillsList.appendChild(li);
      });
    }

    // Update Progress Bars
    if (statAttack) statAttack.style.width = `${data.stats.attack}%`;
    if (statJump) statJump.style.width = `${data.stats.jump}%`;
    if (statDefense) statDefense.style.width = `${data.stats.defense}%`;
    if (statVision) statVision.style.width = `${data.stats.vision}%`;

    if (statAttackNum) statAttackNum.textContent = `${data.stats.attack}%`;
    if (statJumpNum) statJumpNum.textContent = `${data.stats.jump}%`;
    if (statDefenseNum) statDefenseNum.textContent = `${data.stats.defense}%`;
    if (statVisionNum) statVisionNum.textContent = `${data.stats.vision}%`;

    // Update WhatsApp CTA button
    if (hudCta) {
      const phone = "51979833360";
      const encodedMsg = encodeURIComponent(data.ctaMessage);
      hudCta.href = `https://wa.me/${phone}?text=${encodedMsg}`;
    }
  }

  // Bind click on court nodes
  nodeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-position-key');
      selectPosition(key);
    });
  });

  // Bind click on position tabs
  tabButtons.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const key = tab.getAttribute('data-pos-tab');
      selectPosition(key);
    });
  });

  // Default selection: Punta
  selectPosition('punta');
}
