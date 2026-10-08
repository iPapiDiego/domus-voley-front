/**
 * Background Sports Video Controller
 */
export function initVideoCtrl() {
  const video = document.getElementById('hero-bg-video');
  const toggleBtn = document.getElementById('video-toggle-btn');
  const statusIndicator = document.getElementById('video-status-text');

  if (!video || !toggleBtn) return;

  // Make sure it starts muted for reliable autoplay
  video.muted = true;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay was prevented (e.g. power saver mode), fallback gracefully
      if (statusIndicator) statusIndicator.textContent = 'PAUSADO';
    });
  }

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      if (statusIndicator) statusIndicator.textContent = 'EN VIVO';
      toggleBtn.setAttribute('aria-label', 'Pausar video de fondo');
      toggleBtn.classList.add('border-teal-400');
    } else {
      video.pause();
      if (statusIndicator) statusIndicator.textContent = 'PAUSADO';
      toggleBtn.setAttribute('aria-label', 'Reproducir video de fondo');
      toggleBtn.classList.remove('border-teal-400');
    }
  });
}
