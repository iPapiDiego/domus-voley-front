import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP & ScrollTrigger Animations Controller
 * Rock-solid animations with graceful fallback
 */
export function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // 1. HERO ENTRANCE TIMELINE
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo('.hero-badge', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
    )
    .fromTo('.hero-title-line', 
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.9 },
      '-=0.5'
    )
    .fromTo('.hero-desc', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    )
    .fromTo('.hero-actions', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    )
    .fromTo('.hero-crest-container', 
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.5)' },
      '-=0.8'
    )
    .fromTo('.hero-stat-card', 
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7 },
      '-=0.5'
    );

  // Hero Logo Floating Animation
  gsap.to('.hero-crest-float', {
    y: -10,
    rotation: 1.2,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  // 2. NUMBER COUNTERS ANIMATION (Stats)
  const statNumbers = document.querySelectorAll('.stat-counter');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target') || '0', 10);
    const suffix = stat.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            stat.textContent = Math.floor(obj.val) + suffix;
          }
        });
      }
    });
  });

  // Helper for scroll triggered section animations
  const animateSectionCards = (sectionSelector, cardSelector, staggerTime = 0.1) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;
    const cards = section.querySelectorAll(cardSelector);
    if (!cards.length) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: staggerTime,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true
        }
      }
    );
  };

  // 3. SECTION HEADERS REVEAL
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    gsap.fromTo(header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 90%',
          once: true
        }
      }
    );
  });

  // 4. FUNDAMENTOS SKILL CARDS
  animateSectionCards('#fundamentos', '.card-sport', 0.1);

  // 5. CATEGORY CARDS
  animateSectionCards('#categorias', '.category-card', 0.12);

  // 6. BENEFITS CARDS
  animateSectionCards('#metodologia', '.benefit-card', 0.1);

  // 7. SCHEDULE CARDS
  animateSectionCards('#horarios', '.schedule-card', 0.15);

  // 8. GALLERY ITEMS
  animateSectionCards('#galeria', '.gallery-item', 0.08);

  // 9. ABOUT SECTION SPLIT
  const aboutSection = document.querySelector('#nosotros');
  if (aboutSection) {
    const leftCol = aboutSection.querySelector('.about-left');
    const rightCol = aboutSection.querySelector('.about-right');

    if (leftCol && rightCol) {
      gsap.fromTo(leftCol,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 85%',
            once: true
          }
        }
      );

      gsap.fromTo(rightCol,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 85%',
            once: true
          }
        }
      );
    }
  }

  // 10. CTA BANNER
  const ctaBanner = document.querySelector('.cta-banner-card');
  if (ctaBanner) {
    gsap.fromTo(ctaBanner,
      { opacity: 0, scale: 0.96, y: 25 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: ctaBanner,
          start: 'top 90%',
          once: true
        }
      }
    );
  }

  // Refresh triggers when all media finishes loading
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}
