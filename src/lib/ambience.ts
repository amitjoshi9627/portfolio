/**
 * Tiny synthesised sound design — no external audio files.
 * A whimsical nature tone (soft wind / meadow ambiance) and a magical chime for cuts.
 * Always opt-in: nothing plays until the user turns sound on.
 */

let ctx: AudioContext | null = null;
let bed: { master: GainNode; nodes: AudioScheduledSourceNode[] } | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function noiseBuffer(ac: AudioContext, seconds = 3): AudioBuffer {
  const length = Math.floor(ac.sampleRate * seconds);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    // pink-ish noise for softer wind
    last = (last + 0.05 * white) / 1.05;
    data[i] = last * 2.5;
  }
  return buffer;
}

export function startAmbience() {
  const ac = getContext();
  if (!ac || bed) return;
  if (ac.state === "suspended") void ac.resume();

  const master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  // ── Convolution-style "room" via a short delay + feedback ──
  const delay = ac.createDelay(0.6);
  delay.delayTime.value = 0.38;
  const delayFeedback = ac.createGain();
  delayFeedback.gain.value = 0.28;
  const delayWet = ac.createGain();
  delayWet.gain.value = 0.22;

  delay.connect(delayFeedback).connect(delay);
  delay.connect(delayWet).connect(master);

  // ── Riverside Background Noise ──
  const activeNodes: AudioScheduledSourceNode[] = [];
  
  const noiseBuf = noiseBuffer(ac, 5);
  const noiseSrc = ac.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  noiseSrc.loop = true;
  
  const riverFilter = ac.createBiquadFilter();
  riverFilter.type = "lowpass";
  riverFilter.frequency.value = 350; // deep rushing water
  
  const riverGain = ac.createGain();
  riverGain.gain.value = 0.15; // subtle river volume
  
  noiseSrc.connect(riverFilter).connect(riverGain).connect(master);
  noiseSrc.start(ac.currentTime);
  activeNodes.push(noiseSrc);

  // ── Piano note helper ──
  // Uses a triangle oscillator + 2nd-harmonic sine to mimic a muted piano string.
  const playPianoNote = (freq: number, when: number, dur: number, vol = 0.18) => {
    const fundamental = ac.createOscillator();
    fundamental.type = "triangle";
    fundamental.frequency.value = freq;

    const harmonic = ac.createOscillator();
    harmonic.type = "sine";
    harmonic.frequency.value = freq * 2;

    const env = ac.createGain();
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(vol, when + 0.015);       // soft attack
    env.gain.exponentialRampToValueAtTime(vol * 0.45, when + 0.2); // quick initial drop
    env.gain.exponentialRampToValueAtTime(0.0001, when + dur);  // long natural decay

    const harmonicGain = ac.createGain();
    harmonicGain.gain.value = 0.15; // subtle overtone

    fundamental.connect(env);
    harmonic.connect(harmonicGain).connect(env);
    env.connect(master);     // dry signal
    env.connect(delay);      // wet / room tail

    fundamental.start(when);
    harmonic.start(when);
    fundamental.stop(when + dur + 0.1);
    harmonic.stop(when + dur + 0.1);
  };

  // ── E Minor cinematic scale for a riverside vibe ──
  const scale = [
    329.63, // E4 (0)
    392.00, // G4 (1)
    440.00, // A4 (2)
    493.88, // B4 (3)
    587.33, // D5 (4)
    659.25, // E5 (5)
    783.99, // G5 (6)
  ];

  // Pre-composed sparse phrases at ~50 bpm (slower, more reflective)
  const BPM = 50;
  const beat = 60 / BPM;

  // A flowing, emotional repeating motif — 32-beat loop
  const motif: { idx: number; beat: number; dur: number; vol: number }[] = [
    { idx: 0, beat: 0,    dur: 4.5, vol: 0.18 }, // E4
    { idx: 3, beat: 2.5,  dur: 4.0, vol: 0.14 }, // B4
    { idx: 4, beat: 5,    dur: 3.5, vol: 0.15 }, // D5
    { idx: 2, beat: 9,    dur: 3.0, vol: 0.11 }, // A4
    { idx: 5, beat: 12.5, dur: 5.0, vol: 0.16 }, // E5
    { idx: 1, beat: 16,   dur: 3.5, vol: 0.12 }, // G4
    { idx: 6, beat: 19.5, dur: 5.5, vol: 0.14 }, // G5
    { idx: 3, beat: 23,   dur: 4.0, vol: 0.10 }, // B4
    { idx: 4, beat: 27,   dur: 5.0, vol: 0.13 }, // D5
    { idx: 0, beat: 31,   dur: 6.0, vol: 0.12 }, // E4
  ];

  const loopDuration = 32 * beat; // seconds per loop

  // Schedule the motif in a repeating interval
  let loopCount = 0;
  const scheduleLoop = () => {
    const startTime = ac.currentTime + (loopCount === 0 ? 2.0 : 0); // initial 2s silence
    motif.forEach(({ idx, beat: b, dur, vol }) => {
      // Occasional random note skip for breathing room, except for the root notes
      if (loopCount > 0 && idx !== 0 && Math.random() < 0.25) return;
      playPianoNote(scale[idx], startTime + b * beat, dur, vol);
    });
    loopCount++;
  };

  scheduleLoop(); // schedule first loop immediately
  const loopTimer = window.setInterval(scheduleLoop, loopDuration * 1000);

  // Fade in gently
  master.gain.linearRampToValueAtTime(0.22, ac.currentTime + 3.5);

  // @ts-ignore
  bed = { master, nodes: activeNodes, interval: loopTimer };
}

export function stopAmbience() {
  const ac = getContext();
  if (!ac || !bed) return;
  const { master, nodes } = bed;
  // @ts-ignore
  if (bed.interval) clearInterval(bed.interval);
  bed = null;
  master.gain.cancelScheduledValues(ac.currentTime);
  master.gain.setValueAtTime(master.gain.value, ac.currentTime);
  master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.8);
  window.setTimeout(() => {
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    master.disconnect();
  }, 1000);
}

let lastShutterTime = 0;

/** Crisp, magical chime / tactile shutter click used on scene cuts and menu selections. */
export function shutter(volume = 0.16) {
  const ac = getContext();
  if (!ac) return;
  if (ac.state === "suspended") {
    ac.resume().catch(() => {});
  }
  const now = ac.currentTime;
  if (now - lastShutterTime < 0.25) return; // Prevent duplicate overlap
  lastShutterTime = now;

  // Primary crystal chime tone
  const osc1 = ac.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, now);
  osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

  // Sparkle overtone
  const osc2 = ac.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1760, now);
  osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.06);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ac.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.3);
  osc2.stop(now + 0.3);
}
