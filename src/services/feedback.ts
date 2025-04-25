// Haptic and Audio Feedback System
// Simulates premium taptic engine feel using audio + vibration

// Short, crisp click sound (synthesized to avoid assets)
const playClickSound = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'light') {
            // Crisp tick (like Apple picker)
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'medium') {
            // Thock sound (like keyboard)
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'heavy') {
            // Deep thud
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.type = 'triangle';
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'success') {
            // Success chime
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.type = 'sine';
            osc.start(now);
            osc.stop(now + 0.2);
        }
    } catch (e) {
        // Ignore audio errors
    }
};

export const triggerFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    // 1. Audio "Haptic"
    playClickSound(type);

    // 2. Vibration API
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        switch (type) {
            case 'light':
                navigator.vibrate(5); // Very sharp tick
                break;
            case 'medium':
                navigator.vibrate(12); // Solid tap
                break;
            case 'heavy':
            case 'error':
                navigator.vibrate(25); // Heavy thud
                break;
            case 'success':
                navigator.vibrate([10, 30, 10]); // Double tap
                break;
        }
    }
};
