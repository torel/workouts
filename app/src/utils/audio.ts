// Audio context for beeps and chimes
let audioContext: AudioContext | null = null;
let isMuted = false;

export const initAudio = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  } catch (error) {
    console.warn('Audio context not supported:', error);
  }
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  localStorage.setItem('audio-muted', muted ? '1' : '0');
};

export const isMutedState = (): boolean => {
  return isMuted;
};

export const loadMutedState = () => {
  isMuted = localStorage.getItem('audio-muted') === '1';
  return isMuted;
};

const playTone = (frequency: number, duration: number, volume = 0.3) => {
  if (isMuted || !audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Error playing tone:', error);
  }
};

export const playBeep = () => {
  playTone(800, 0.15);
};

export const playCountdownBeep = () => {
  playTone(600, 0.1);
};

export const playFinishChime = () => {
  if (isMuted || !audioContext) return;
  
  try {
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 0.2), i * 150);
    });
  } catch (error) {
    console.warn('Error playing finish chime:', error);
  }
};
