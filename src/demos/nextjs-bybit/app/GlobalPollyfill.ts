'use client';

import { useEffect } from 'react';
import { applyGlobalPolyfill } from '../lib/global-pollyfill';

export function GlobalPolyfill() {
  useEffect(() => {
    applyGlobalPolyfill();
  }, []);

  return null;
}
