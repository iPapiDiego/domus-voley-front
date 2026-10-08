/**
 * Domus Voleibol Club - Master Script Entrypoint (V2)
 * Strictly separated client JavaScript architecture.
 */

import { initNavbarV2 } from './navbar.js';
import { initVideoController } from './video-controller.js';
import { initTacticalBoard } from './tactical-board.js';
import { initCategoryMatrix } from './category-matrix.js';
import { initCalculator } from './calculator.js';
import { initGalleryV2 } from './gallery-filter.js';
import { initModalV2 } from './modal.js';
import { initAnimationsV2 } from './animations.js';

function bootstrapV2() {
  initNavbarV2();
  initVideoController();
  initTacticalBoard();
  initCategoryMatrix();
  initCalculator();
  initGalleryV2();
  initModalV2();
  initAnimationsV2();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapV2);
} else {
  bootstrapV2();
}
