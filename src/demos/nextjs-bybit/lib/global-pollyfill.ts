export const applyGlobalPolyfill = () => {
  if (typeof window !== 'undefined') {
    (window as any).global = window;
  }
};
