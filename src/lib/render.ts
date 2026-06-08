import type {
  Background,
  ImageFit,
  LoadedImage,
  OgConfig,
  RenderTarget,
  TextLayer,
} from './types';
import { createCanvasGradient } from './gradient';
import { wrapText } from './text';

/** Neutral fill used when an image background has no image loaded yet. */
export const IMAGE_PLACEHOLDER_COLOR = '#1e293b';

/** Build the CSS/canvas `font` shorthand for a text layer. */
export function fontString(layer: TextLayer): string {
  return `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
}

/** Pixel height of one line for a layer. */
export function lineHeightPx(layer: TextLayer): number {
  return layer.fontSize * layer.lineHeight;
}

/** X coordinate of the text anchor for a given alignment. */
export function alignX(align: TextLayer['align'], padding: number, maxWidth: number): number {
  if (align === 'center') return padding + maxWidth / 2;
  if (align === 'right') return padding + maxWidth;
  return padding;
}

export interface ImageRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/** Position/scale an `iw`×`ih` image inside a `width`×`height` frame for a fit mode. */
export function computeImageRect(
  fit: ImageFit,
  iw: number,
  ih: number,
  width: number,
  height: number,
): ImageRect {
  if (fit === 'fill') {
    return { dx: 0, dy: 0, dw: width, dh: height };
  }
  const scale =
    fit === 'cover'
      ? Math.max(width / iw, height / ih)
      : Math.min(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  return { dx: (width - dw) / 2, dy: (height - dh) / 2, dw, dh };
}

/** Paint the background layer (solid, gradient, or image + optional overlay). */
export function drawBackground(
  ctx: RenderTarget,
  background: Background,
  width: number,
  height: number,
  image: LoadedImage | null,
): void {
  if (background.type === 'solid') {
    ctx.fillStyle = background.color;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (background.type === 'gradient') {
    ctx.fillStyle = createCanvasGradient(ctx, background, width, height);
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (image) {
    const rect = computeImageRect(background.fit, image.width, image.height, width, height);
    ctx.drawImage(image.source, rect.dx, rect.dy, rect.dw, rect.dh);
  } else {
    ctx.fillStyle = IMAGE_PLACEHOLDER_COLOR;
    ctx.fillRect(0, 0, width, height);
  }
  if (background.overlay) {
    ctx.fillStyle = background.overlay;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawLines(
  ctx: RenderTarget,
  layer: TextLayer,
  lines: string[],
  startY: number,
  padding: number,
  maxWidth: number,
): number {
  ctx.fillStyle = layer.color;
  ctx.font = fontString(layer);
  ctx.textAlign = layer.align;
  ctx.textBaseline = 'top';
  const x = alignX(layer.align, padding, maxWidth);
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeightPx(layer);
  }
  return y;
}

function measureLayer(ctx: RenderTarget, layer: TextLayer, maxWidth: number): string[] {
  ctx.font = fontString(layer);
  return wrapText(ctx, layer.text, maxWidth);
}

/** Render a full Open Graph card onto a canvas context. */
export function renderOg(
  ctx: RenderTarget,
  config: OgConfig,
  image: LoadedImage | null = null,
): void {
  const { width, height, padding, title, subtitle } = config;
  drawBackground(ctx, config.background, width, height, image);

  const maxWidth = width - padding * 2;
  const titleLines = measureLayer(ctx, title, maxWidth);
  const subtitleLines = subtitle ? measureLayer(ctx, subtitle, maxWidth) : [];
  const gap = subtitle ? lineHeightPx(title) * 0.35 : 0;

  const titleHeight = titleLines.length * lineHeightPx(title);
  const subtitleHeight = subtitleLines.length * lineHeightPx(subtitle ?? title);
  const totalHeight = titleHeight + subtitleHeight + gap;

  let y = (height - totalHeight) / 2;
  y = drawLines(ctx, title, titleLines, y, padding, maxWidth);
  if (subtitle) {
    drawLines(ctx, subtitle, subtitleLines, y + gap, padding, maxWidth);
  }
}
