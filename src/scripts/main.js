import { initNavbar } from './navbar.js';
import { initAnimations } from './animations.js';
import { initFaq } from './faq.js';
import { initModal } from './modal.js';
import { initVideoCtrl } from './video-ctrl.js';
import { initGalleryModal } from './gallery-modal.js';

/**
 * Domus Voleibol Club - Main Application Entrypoint
 * Completely separated JavaScript architecture
 */
function init() {
  try {
    initNavbar();
    initAnimations();
    initFaq();
    initModal();
    initVideoCtrl();
    initGalleryModal();
  } catch (error) {
    console.error('Error initializing Domus Voley scripts:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
