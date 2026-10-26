// src/utils/soundEffects.ts
// Bộ tạo âm thanh chuẩn sử dụng Web Audio API tích hợp
// Không phụ thuộc file mp3 ngoài, bảo đảm chạy mượt 100% trên mọi trình duyệt

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Âm thanh khi click ô chữ cái (gỗ nhẹ, thanh thoát)
  public playTileClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignore audio error if user hasn't interacted
    }
  }

  // Âm thanh khi tìm được 1 từ trong ma trận (hợp âm hân hoan)
  public playWordFound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteStart = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.26);
      });
    } catch {}
  }

  // Âm thanh khi ghép đúng câu hỏi vào hàng ngang (tiếng chuông thành công)
  public playMatchSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteStart = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.36);
      });
    } catch {}
  }

  // Âm thanh khi lật 1 chữ cái ô chữ hàng ngang (flip)
  public playLetterFlip(delayMs: number = 0) {
    if (this.isMuted) return;
    setTimeout(() => {
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch {}
    }, delayMs);
  }

  // Âm thanh khi chọn sai (rung nhẹ)
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  // Âm thanh chiến thắng giải được TỪ HÀNG DỌC (khúc tráng ca vinh quang)
  public playGrandVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Tráng ca kèn đồng và chuông ngân
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.15 }, // C5
        { f: 523.25, t: 0.18, d: 0.15 }, // C5
        { f: 523.25, t: 0.36, d: 0.15 }, // C5
        { f: 659.25, t: 0.54, d: 0.4 },  // E5
        { f: 783.99, t: 0.96, d: 0.3 },  // G5
        { f: 1046.5, t: 1.28, d: 0.8 },  // C6 (ngân dài)
      ];

      fanfare.forEach(note => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteStart = now + note.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, noteStart);

        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteStart);
        osc.stop(noteStart + note.d + 0.05);
      });
    } catch {}
  }
}

export const sound = new SoundManager();
