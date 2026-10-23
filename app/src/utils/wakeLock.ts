let wakeLock: any = null;

export const requestWakeLock = async (): Promise<boolean> => {
  if (!('wakeLock' in navigator)) {
    return false;
  }

  try {
    wakeLock = await (navigator as any).wakeLock.request('screen');
    
    wakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
    });
    
    return true;
  } catch (error) {
    console.warn('Wake lock request failed:', error);
    return false;
  }
};

export const releaseWakeLock = async (): Promise<void> => {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
    } catch (error) {
      console.warn('Wake lock release failed:', error);
    }
  }
};

export const isWakeLockSupported = (): boolean => {
  return 'wakeLock' in navigator;
};
