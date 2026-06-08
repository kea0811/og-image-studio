import type { GradientBackground, GradientStop, RenderTarget } from './types';
import { clamp, round } from './util';

/** Return a copy of `stops` ordered by ascending offset. */
export function sortStops(stops: GradientStop[]): GradientStop[] {
  return [...stops].sort((a, b) => a.offset - b.offset);
}

/** Render a gradient to a CSS `background-image` string (for live preview). */
export function gradientToCss(gradient: GradientBackground): string {
  const stops = sortStops(gradient.stops)
    .map((stop) => `${stop.color} ${round(clamp(stop.offset, 0, 1) * 100)}%`)
    .join(', ');
  if (gradient.variant === 'radial') {
    return `radial-gradient(circle at center, ${stops})`;
  }
  return `linear-gradient(${gradient.angle}deg, ${stops})`;
}

/**
 * Convert a CSS gradient angle to the canvas line `[x0, y0, x1, y1]` that
 * passes through the centre of a `width`×`height` box. `0deg` points up.
 */
export function angleToLine(
  angle: number,
  width: number,
  height: number,
): [number, number, number, number] {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const length = Math.abs(width * dx) + Math.abs(height * dy);
  const cx = width / 2;
  const cy = height / 2;
  return [cx - (dx * length) / 2, cy - (dy * length) / 2, cx + (dx * length) / 2, cy + (dy * length) / 2];
}

/** Build a canvas gradient object ready to assign to `ctx.fillStyle`. */
export function createCanvasGradient(
  ctx: RenderTarget,
  gradient: GradientBackground,
  width: number,
  height: number,
): CanvasGradient {
  const canvasGradient =
    gradient.variant === 'radial'
      ? ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 2,
        )
      : ctx.createLinearGradient(...angleToLine(gradient.angle, width, height));
  for (const stop of sortStops(gradient.stops)) {
    canvasGradient.addColorStop(clamp(stop.offset, 0, 1), stop.color);
  }
  return canvasGradient;
}
