
export class SoundManager {
  private static audioCtx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static bgMusic: HTMLAudioElement | null = null;

  static init() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.connect(this.audioCtx.destination);
    this.masterGain.gain.value = 0.25;

    // Use a high-quality, stable royalty-free romantic track
    // This is a direct link to a romantic piano piece
    this.bgMusic = new Audio('https://cdn.pixabay.com/audio/2022/08/04/audio_2dbc14533a.mp3'); 
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0; 
    this.bgMusic.crossOrigin = "anonymous";
    this.bgMusic.load();
  }

  static playMusic() {
    if (this.bgMusic) {
      this.bgMusic.play().then(() => {
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (!this.bgMusic) {
            clearInterval(fadeIn);
            return;
          }
          if (vol < 0.35) {
            vol += 0.01;
            this.bgMusic.volume = Math.min(vol, 1);
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
      }).catch(e => {
        console.warn("Background music play failed:", e);
      });
    }
  }

  static stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  static async play(type: 'open' | 'chime') {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain!);

    if (type === 'open') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, this.audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.4);
    } else if (type === 'chime') {
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.masterGain!);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, this.audioCtx.currentTime); // C6
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, this.audioCtx.currentTime); // E6
      gain2.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.2);

      osc.start();
      osc2.start();
      osc.stop(this.audioCtx.currentTime + 1.2);
      osc2.stop(this.audioCtx.currentTime + 1.2);
    }
  }
}
