'use client';

import { useEffect, type RefObject } from 'react';
import { renderOg } from '@/src/lib/render';
import type { LoadedImage, OgConfig } from '@/src/lib/types';

export function Preview({
  config,
  image,
  canvasRef,
}: {
  config: OgConfig;
  image: LoadedImage | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderOg(ctx, config, image);
  }, [config, image, canvasRef]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-glow">
      <canvas
        ref={canvasRef}
        width={config.width}
        height={config.height}
        role="img"
        aria-label={`Open Graph preview: ${config.title.text}${
          config.subtitle ? ` — ${config.subtitle.text}` : ''
        }`}
        className="block h-auto w-full"
      />
    </div>
  );
}
