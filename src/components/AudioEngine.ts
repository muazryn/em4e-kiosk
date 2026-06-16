// Web Audio API Sound Synthesizer for Interactive Kiosk feedback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard AudioContext initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (browser security policy for user-interaction audio)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  click: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio play blocked or unsupported:", e);
    }
  },

  correct: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const parentGain = ctx.createGain();
      parentGain.connect(ctx.destination);
      parentGain.gain.setValueAtTime(0.12, ctx.currentTime);

      // Chime note 1 (E5)
      const osc1 = ctx.createOscillator();
      osc1.connect(parentGain);
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Chime note 2 (G5) at +0.1s
      const osc2 = ctx.createOscillator();
      osc2.connect(parentGain);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.45);

      // Chime note 3 (C6) at +0.2s
      const osc3 = ctx.createOscillator();
      osc3.connect(parentGain);
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.2);
      osc3.start(ctx.currentTime + 0.2);
      osc3.stop(ctx.currentTime + 0.6);

      // Volume envelope decay
      parentGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2);
      parentGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    } catch (e) {
      console.warn(e);
    }
  },

  incorrect: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn(e);
    }
  },

  victory: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const parentGain = ctx.createGain();
      parentGain.connect(ctx.destination);
      parentGain.gain.setValueAtTime(0.1, ctx.currentTime);

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major scale arpeggio
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.connect(parentGain);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + 0.7 + i * 0.1);
      });

      parentGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.6);
      parentGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    } catch (e) {
      console.warn(e);
    }
  }
};
