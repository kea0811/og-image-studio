'use client';

import { useEffect, useState } from 'react';
import type { LoadedImage } from '@/src/lib/types';

/**
 * Load an image source into a canvas-drawable element.
 *
 * The whole lifecycle (create -> onload -> set state) lives inside one effect so
 * it stays correct under React 19 StrictMode, which mounts, unmounts and remounts
 * effects in development. A `cancelled` flag prevents a stale load from updating
 * state after the source has changed.
 */
export function useLoadedImage(src: string | null): LoadedImage | null {
  const [image, setImage] = useState<LoadedImage | null>(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    let cancelled = false;
    const element = new Image();
    element.crossOrigin = 'anonymous';
    element.onload = () => {
      if (!cancelled) {
        setImage({ source: element, width: element.naturalWidth, height: element.naturalHeight });
      }
    };
    element.onerror = () => {
      if (!cancelled) {
        setImage(null);
      }
    };
    element.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return image;
}
