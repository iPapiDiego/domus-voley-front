/**
 * Domus Voleibol Club - GSAP Motion Presets & ScrollTrigger (V2)
 * Follows UI/UX Pro Max motion standards with reduced-motion support.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimationsV2() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Show all animated elements without transform delays
    document.querySelectorAll('[data-reveal], [data-reveal-stagger], [data-hero-elem]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // 1. Hero Reveal Timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const heroBadge = document.querySelector('[data-hero-badge]');
  const heroTitle = document.querySelector('[data-hero-title]');
  const heroSubtitle = document.querySelector('[data-hero-subtitle]');
  const heroActions = document.querySelector('[data-hero-actions]');
  const heroStats = document.querySelector('[data-hero-stats]');

  if (heroBadge) {
    heroTl.fromTo(heroBadge, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 });
  }
  if (heroTitle) {
    heroTl.fromTo(heroTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
  }
  if (heroSubtitle) {
    heroTl.fromTo(heroSubtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
  }
  if (heroActions) {
    heroTl.fromTo(heroActions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
  }
  if (heroStats) {
    heroTl.fromTo(heroStats, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3');
  }

  // 2. Section Headings Reveal
  const sectionHeadings = document.querySelectorAll('[data-section-heading]');
  sectionHeadings.forEach(heading => {
    gsap.fromTo(
      heading,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: heading,
          start: 'top 92%',
          once: true
        }
      }
    );
  });

  // 3. Bento & Grid Cards Stagger Reveal
  const staggerContainers = document.querySelectorAll('[data-reveal-stagger]');
  staggerContainers.forEach(container => {
    const cards = container.children;
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            once: true
          }
        }
      );
    }
  });

  // 4. Numerical Counter Animation
  const counters = document.querySelectorAll('[data-count-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count-target') || '0', 10);
    const suffix = counter.getAttribute('data-count-suffix') || '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        let current = 0;
        const duration = 1200;
        const stepTime = Math.max(16, duration / target);
        const timer = setInterval(() => {
          current += Math.ceil(target / (duration / stepTime));
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = current + suffix;
        }, stepTime);
      }
    });
  });

  // 5. Mobile & Fullpage Screenshot Failsafe: Ensure visible state after timeout
  setTimeout(() => {
    document.querySelectorAll('[data-reveal-stagger] > *, [data-section-heading]').forEach(el => {
      const currentOpacity = parseFloat(window.getComputedStyle(el).opacity);
      if (currentOpacity < 0.2) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.3 });
      }
    });
  }, 1200);

  // Refresh ScrollTrigger after resources render
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  }, { passive: true });
}
