'use client';

import { useEffect, useRef } from 'react';
import { Gradient } from '@/lib/stripe-gradient';

export function StripeGradient() {
  const gradientRef = useRef<any>(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (gradientRef.current) return;

    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
    gradientRef.current = gradient;

    // Cleanup function to disconnect observer if component unmounts
    return () => {
      if (gradientRef.current) {
        gradientRef.current.disconnect();
        gradientRef.current = null;
      }
    };
  }, []);

  return <canvas id="gradient-canvas" data-transition-in></canvas>;
}
