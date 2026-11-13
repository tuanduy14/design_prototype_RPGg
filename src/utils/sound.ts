// Pure Web Audio API 8-bit retro chiptune sound effects

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    volume = 0.08,
    delay = 0,
    slideToFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideToFreq), startTime + duration);
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  playTrainClick() {
    this.playTone(340, 0.06, 'square', 0.06, 0, 520);
  }

  playTapAttack() {
    const jitter = (Math.random() - 0.5) * 60;
    this.playTone(460 + jitter, 0.045, 'triangle', 0.08, 0, 220);
  }

  playHeavyStrike() {
    this.playTone(190, 0.14, 'sawtooth', 0.11, 0, 65);
    this.playTone(580, 0.09, 'square', 0.07, 0.02, 240);
  }

  playMonsterHit() {
    this.playTone(150, 0.18, 'sawtooth', 0.1, 0, 55);
  }

  playLevelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.12, 'square', 0.075, idx * 0.07);
    });
  }

  playVictory() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((n, idx) => {
      this.playTone(n, idx === 3 ? 0.28 : 0.1, 'square', 0.08, idx * 0.08);
    });
  }

  playGameOver() {
    const notes = [330, 293.66, 261.63, 196];
    notes.forEach((n, idx) => {
      this.playTone(n, idx === 3 ? 0.35 : 0.14, 'sawtooth', 0.075, idx * 0.12);
    });
  }

  playBuyEquip() {
    this.playTone(587.33, 0.07, 'square', 0.07, 0);
    this.playTone(880, 0.12, 'square', 0.07, 0.06);
  }

  playPotionHeal() {
    this.playTone(392, 0.09, 'sine', 0.09, 0, 587);
    this.playTone(587, 0.14, 'sine', 0.09, 0.08, 784);
  }

  playTabSwitch() {
    this.playTone(420, 0.04, 'triangle', 0.045);
  }
}

export const sound = new RetroSoundEngine();
