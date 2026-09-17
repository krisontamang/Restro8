// Web Audio API synthesized cues for POS and Kitchen operations
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isAudioEnabled(): boolean {
  return soundEnabled;
}

/**
 * Pleasant POS Ding when an item is added to the cart
 */
export function playCartDing() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.debug('Audio playback suppressed', e);
  }
}

/**
 * Kitchen Bell Chime when a new order is dispatched to KDS
 */
export function playOrderSentChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Two-tone bright kitchen bell
    const t0 = ctx.currentTime;
    [
      { freq: 659.25, time: 0, dur: 0.35, gain: 0.15 }, // E5
      { freq: 987.77, time: 0.12, dur: 0.45, gain: 0.18 }, // B5
    ].forEach(({ freq, time, dur, gain: vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t0 + time);

      gain.gain.setValueAtTime(vol, t0 + time);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0 + time);
      osc.stop(t0 + time + dur);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Satisfying Bump Chime when ticket status is completed
 */
export function playBumpChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    [
      { freq: 523.25, time: 0, dur: 0.15 }, // C5
      { freq: 659.25, time: 0.08, dur: 0.2 }, // E5
      { freq: 783.99, time: 0.16, dur: 0.35 }, // G5
    ].forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0 + time);

      gain.gain.setValueAtTime(0.12, t0 + time);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0 + time);
      osc.stop(t0 + time + dur);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

/**
 * Payment settled chime
 */
export function playPaymentSuccessChime() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    [
      { freq: 440, time: 0, dur: 0.2 },
      { freq: 554.37, time: 0.08, dur: 0.2 },
      { freq: 659.25, time: 0.16, dur: 0.25 },
      { freq: 880, time: 0.24, dur: 0.45 },
    ].forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0 + time);
      gain.gain.setValueAtTime(0.14, t0 + time);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0 + time);
      osc.stop(t0 + time + dur);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}
