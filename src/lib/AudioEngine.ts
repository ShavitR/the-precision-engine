'use client';

class AudioEngine {
    private ctx: AudioContext | null = null;
    private primaryOsc: OscillatorNode | null = null;
    private secondaryOsc: OscillatorNode | null = null;
    private masterGain: GainNode | null = null;
    private autoFilter: BiquadFilterNode | null = null;

    private isInitialized = false;
    private isPlaying = false;

    public init() {
        if (this.isInitialized) return;

        // Fallback for Safari
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        this.ctx = new AudioContextClass();

        // Core structure: Osc -> Filter -> Gain -> Destination
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0; // start muted

        this.autoFilter = this.ctx.createBiquadFilter();
        this.autoFilter.type = 'lowpass';
        this.autoFilter.frequency.value = 200; // Deep initial hum

        // Deep bass drone
        this.primaryOsc = this.ctx.createOscillator();
        this.primaryOsc.type = 'sine';
        this.primaryOsc.frequency.value = 55; // 55Hz (Low A)

        // Harmony drone
        this.secondaryOsc = this.ctx.createOscillator();
        this.secondaryOsc.type = 'triangle';
        this.secondaryOsc.frequency.value = 82.41; // 82.41Hz (Low E)

        // Routing
        this.primaryOsc.connect(this.autoFilter);
        this.secondaryOsc.connect(this.autoFilter);
        this.autoFilter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.primaryOsc.start();
        this.secondaryOsc.start();

        this.isInitialized = true;
    }

    public toggle() {
        if (!this.isInitialized) {
            this.init();
        }

        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        if (this.masterGain) {
            if (this.isPlaying) {
                // Fade out
                this.masterGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.5);
            } else {
                // Fade in
                this.masterGain.gain.setTargetAtTime(0.3, this.ctx!.currentTime, 1.0);
            }
        }

        this.isPlaying = !this.isPlaying;
        return this.isPlaying;
    }

    public getStatus() {
        return this.isPlaying;
    }

    // Called in a rAF loop or global scroll hook
    public update(progress: number, velocity: number) {
        if (!this.isPlaying || !this.ctx || !this.autoFilter) return;

        // Map progress (0-1) to filter frequency opening up
        const baseFreq = 200;
        const targetFreq = baseFreq + (progress * 1000); // Opens up to 1200Hz

        // Add velocity texture
        const dynamicFreq = targetFreq + (Math.abs(velocity) * 2000); // spikes with speed

        // Smooth transition
        this.autoFilter.frequency.setTargetAtTime(
            Math.min(dynamicFreq, 5000), // Cap at 5kHz
            this.ctx.currentTime,
            0.1
        );

        // Add small dissonance modulation to secondary osc based on progress
        if (this.secondaryOsc) {
            const baseSecFreq = 82.41;
            this.secondaryOsc.frequency.setTargetAtTime(
                baseSecFreq + (progress * 5), // slightly detunes as it goes down
                this.ctx.currentTime,
                0.1
            );
        }
    }
}

export const instance = new AudioEngine();
