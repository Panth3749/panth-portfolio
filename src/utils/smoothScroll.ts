import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const initSmoothScroll = (): Lenis => {
  if (typeof window === 'undefined') return null as unknown as Lenis;

  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential easing
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  const raf = (time: number) => {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  return lenisInstance;
};

export const getLenis = (): Lenis | null => {
  return lenisInstance;
};

export const scrollTo = (target: string | HTMLElement | number, offset: number = -60) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};
