/**
 * Domus Voleibol Club - Hero Video Controller (V2)
 */

export function initVideoController() {
  const video = document.querySelector('[data-hero-video]');
  const playToggleBtn = document.querySelector('[data-video-toggle-play]');
  const soundToggleBtn = document.querySelector('[data-video-toggle-sound]');

  if (!video) return;

  // Handle Play/Pause
  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play().then(() => {
          playToggleBtn.setAttribute('aria-label', 'Pausar video de fondo');
          updatePlayIcon(true);
        }).catch(err => console.log('Autoplay play error:', err));
      } else {
        video.pause();
        playToggleBtn.setAttribute('aria-label', 'Reproducir video de fondo');
        updatePlayIcon(false);
      }
    });
  }

  function updatePlayIcon(isPlaying) {
    if (!playToggleBtn) return;
    const playIcon = playToggleBtn.querySelector('[data-icon-play]');
    const pauseIcon = playToggleBtn.querySelector('[data-icon-pause]');
    if (playIcon && pauseIcon) {
      if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      }
    }
  }

  // Handle Sound Mute/Unmute
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      soundToggleBtn.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar sonido');
      const soundOn = soundToggleBtn.querySelector('[data-icon-sound-on]');
      const soundOff = soundToggleBtn.querySelector('[data-icon-sound-off]');
      if (soundOn && soundOff) {
        if (video.muted) {
          soundOn.classList.add('hidden');
          soundOff.classList.remove('hidden');
        } else {
          soundOn.classList.remove('hidden');
          soundOff.classList.add('hidden');
        }
      }
    });
  }
}
