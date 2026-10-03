import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;
type ScrollHandler = (e?: any) => void;
const scrollHandlers = new Set<ScrollHandler>();

export const initSmoothScroll = (): Lenis => {
  if (typeof window === 'undefined') return null as unknown as Lenis;

  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.09,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.65,
    touchMultiplier: 0.85,
    syncTouch: true,
    syncTouchLerp: 0.09,
    virtualScroll: (data) => {
      // Prevent single high-velocity flick or free-wheeling scroll from skipping through the page
      const maxDelta = 110;
      if (Math.abs(data.deltaY) > maxDelta) {
        data.deltaY = Math.sign(data.deltaY) * maxDelta;
      }
      return true;
    },
  });

  // Re-attach registered scroll handlers to this living Lenis instance
  scrollHandlers.forEach((handler) => {
    lenisInstance?.on('scroll', handler);
  });

  const raf = (time: number) => {
    if (lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  };

  rafId = requestAnimationFrame(raf);

  if (typeof window !== 'undefined') {
    (window as any).__lenis = lenisInstance;
  }

  return lenisInstance;
};

export const destroySmoothScroll = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    scrollHandlers.forEach((handler) => {
      lenisInstance?.off('scroll', handler);
    });
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

export const getLenis = (): Lenis | null => {
  return lenisInstance;
};

export const subscribeScroll = (handler: ScrollHandler): (() => void) => {
  scrollHandlers.add(handler);
  if (lenisInstance) {
    lenisInstance.on('scroll', handler);
  }
  window.addEventListener('scroll', handler, { passive: true });

  return () => {
    scrollHandlers.delete(handler);
    if (lenisInstance) {
      lenisInstance.off('scroll', handler);
    }
    window.removeEventListener('scroll', handler);
  };
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
