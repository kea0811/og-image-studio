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
    <div
      className="overflow-hidden rounded-xl border border-white/10"
      style={{
        backgroundImage:
          'linear-gradient(45deg, rgba(255,255,255,0.025) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.025) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.025) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.025) 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }}
    >
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
