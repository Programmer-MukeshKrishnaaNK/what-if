import type { AudioManager, AudioState } from '../app/audio';
import { h } from './dom';

const STATUS_TEXT: Record<AudioState['status'], string> = {
  off: 'Sound off',
  armed: 'Resume sound',
  loading: 'Loading…',
  playing: 'Sound on',
  unavailable: 'Sound unavailable',
};

/**
 * The ambient-sound control: one toggle plus a small settings panel (play/pause,
 * mute, volume). Created once and re-mounted into each page's header slot, so its
 * state — like the sound itself — survives navigation.
 */
export function createAudioControl(manager: AudioManager): HTMLElement {
  const panelId = 'audio-panel';

  const icon = h('span.audio-icon', { 'aria-hidden': 'true' });
  const text = h('span.audio-text');
  const toggle = h('button.audio-toggle', { type: 'button' }, icon, text);

  // On phones this is the only button: it carries the state icon and opens the panel.
  const moreIcon = h('span.audio-icon.audio-more-icon', { 'aria-hidden': 'true' });
  const more = h(
    'button.audio-more',
    { type: 'button', 'aria-expanded': 'false', 'aria-controls': panelId, 'aria-label': 'Sound settings' },
    moreIcon,
    h('span.audio-chevron', { 'aria-hidden': 'true' }),
  );

  const playBtn = h('button.audio-panel-btn', { type: 'button' });
  const muteBtn = h('button.audio-panel-btn', { type: 'button' });
  const volume = h('input.scrubber.audio-volume', { id: 'audio-volume', type: 'range', min: 0, max: 100, step: 1 }) as HTMLInputElement;
  const volumeValue = h('span.audio-volume-value');
  const live = h('span.sr-only', { 'aria-live': 'polite' });

  const panel = h(
    'div.audio-panel',
    { id: panelId, hidden: true, role: 'group', 'aria-label': 'Ambient sound settings' },
    h('p.audio-panel-title', {}, 'Ambient sound'),
    h('div.audio-panel-row', {}, playBtn, muteBtn),
    h(
      'div.audio-volume-row',
      {},
      h('label.audio-volume-label', { for: 'audio-volume' }, 'Volume'),
      volume,
      volumeValue,
    ),
    h('p.audio-panel-note', {}, 'A quiet, looping room tone. Nothing on this site depends on sound.'),
  );

  const root = h('div.audio-control', { role: 'group', 'aria-label': 'Ambient sound' }, toggle, more, panel, live);

  // ---- state → UI ----
  let lastAnnounced = '';
  manager.subscribe((s) => {
    const label = s.status === 'playing' && s.muted ? 'Muted' : STATUS_TEXT[s.status];
    const iconState = s.status === 'unavailable' ? 'unavailable' : s.status === 'playing' ? (s.muted ? 'muted' : 'on') : 'off';
    root.dataset.state = iconState;
    text.textContent = label;
    icon.dataset.state = iconState;
    moreIcon.dataset.state = iconState;
    more.setAttribute('aria-label', `Sound settings (${label.toLowerCase()})`);

    const playing = s.status === 'playing';
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute(
      'aria-label',
      s.status === 'unavailable'
        ? 'Ambient sound unavailable'
        : playing
          ? `Ambient sound on${s.muted ? ', muted' : ''}. Turn off`
          : s.status === 'loading'
            ? 'Ambient sound loading'
            : s.status === 'armed'
              ? 'Ambient sound will resume on your next click or key press. Resume now'
              : 'Ambient sound off. Turn on',
    );
    toggle.disabled = s.status === 'unavailable' || s.status === 'loading';

    playBtn.textContent = playing ? 'Pause' : 'Play';
    playBtn.disabled = s.status === 'unavailable' || s.status === 'loading';
    playBtn.setAttribute('aria-label', playing ? 'Pause ambient sound' : 'Play ambient sound');

    muteBtn.textContent = s.muted ? 'Unmute' : 'Mute';
    muteBtn.setAttribute('aria-pressed', String(s.muted));

    const pct = Math.round(s.volume * 100);
    if (document.activeElement !== volume) volume.value = String(pct);
    volume.setAttribute('aria-valuetext', `${pct}%`);
    volumeValue.textContent = `${pct}%`;
    volume.style.setProperty('--fill', `${pct}%`);

    // Announce real state changes only (not every volume step).
    if (label !== lastAnnounced && s.status !== 'loading') {
      if (lastAnnounced) live.textContent = label;
      lastAnnounced = label;
    }
  });

  // ---- UI → manager ----
  toggle.addEventListener('click', () => manager.toggle());
  playBtn.addEventListener('click', () => manager.toggle());
  muteBtn.addEventListener('click', () => manager.toggleMute());
  volume.addEventListener('input', () => manager.setVolume(Number(volume.value) / 100));

  const setOpen = (open: boolean, returnFocus = false) => {
    panel.hidden = !open;
    more.setAttribute('aria-expanded', String(open));
    if (returnFocus) more.focus();
  };
  more.addEventListener('click', () => setOpen(Boolean(panel.hidden)));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      e.stopPropagation();
      setOpen(false, true);
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (!panel.hidden && !root.contains(e.target as Node)) setOpen(false);
  });
  // Close when navigating away (the control is re-mounted on the next page).
  window.addEventListener('hashchange', () => setOpen(false));

  return root;
}
