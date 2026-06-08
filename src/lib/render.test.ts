import { describe, expect, it, vi } from 'vitest';
import {
  IMAGE_PLACEHOLDER_COLOR,
  alignX,
  computeImageRect,
  drawBackground,
  fontString,
  lineHeightPx,
  renderOg,
} from './render';
import { createDefaultConfig } from './config';
import type { LoadedImage, RenderTarget, TextLayer } from './types';

function baseLayer(overrides: Partial<TextLayer> = {}): TextLayer {
  return {
    text: 'Hello world',
    color: '#ffffff',
    fontSize: 40,
    fontFamily: 'Inter',
    fontWeight: 700,
    lineHeight: 1.2,
    align: 'left',
    ...overrides,
  };
}

function mockTarget() {
  const gradient = { addColorStop: vi.fn() } as unknown as CanvasGradient;
  return {
    fillStyle: '' as string | CanvasGradient | CanvasPattern,
    font: '',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    fillRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
    createLinearGradient: vi.fn(() => gradient),
    createRadialGradient: vi.fn(() => gradient),
  };
}

const loadedImage: LoadedImage = {
  source: {} as CanvasImageSource,
  width: 200,
  height: 100,
};

describe('fontString', () => {
  it('builds the canvas font shorthand', () => {
    expect(fontString(baseLayer())).toBe('700 40px Inter');
  });
});

describe('lineHeightPx', () => {
  it('multiplies font size by line height', () => {
    expect(lineHeightPx(baseLayer({ fontSize: 50, lineHeight: 1.5 }))).toBe(75);
  });
});

describe('alignX', () => {
  it('anchors left, centre and right', () => {
    expect(alignX('left', 80, 1000)).toBe(80);
    expect(alignX('center', 80, 1000)).toBe(580);
    expect(alignX('right', 80, 1000)).toBe(1080);
  });
});

describe('computeImageRect', () => {
  it('fills the whole frame', () => {
    expect(computeImageRect('fill', 100, 100, 1200, 630)).toEqual({
      dx: 0,
      dy: 0,
      dw: 1200,
      dh: 630,
    });
  });
  it('covers the frame (scales up, centres overflow)', () => {
    expect(computeImageRect('cover', 100, 100, 1200, 630)).toEqual({
      dx: 0,
      dy: -285,
      dw: 1200,
      dh: 1200,
    });
  });
  it('contains the image inside the frame', () => {
    expect(computeImageRect('contain', 100, 100, 1200, 630)).toEqual({
      dx: 285,
      dy: 0,
      dw: 630,
      dh: 630,
    });
  });
});

describe('drawBackground', () => {
  it('paints a solid colour', () => {
    const ctx = mockTarget();
    drawBackground(ctx as unknown as RenderTarget, { type: 'solid', color: '#abcdef' }, 1200, 630, null);
    expect(ctx.fillStyle).toBe('#abcdef');
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 1200, 630);
  });
  it('paints a gradient', () => {
    const ctx = mockTarget();
    drawBackground(
      ctx as unknown as RenderTarget,
      { type: 'gradient', variant: 'linear', angle: 90, stops: [{ color: '#000', offset: 0 }, { color: '#fff', offset: 1 }] },
      1200,
      630,
      null,
    );
    expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 1200, 630);
  });
  it('draws a loaded image', () => {
    const ctx = mockTarget();
    drawBackground(ctx as unknown as RenderTarget, { type: 'image', src: 'x', fit: 'cover' }, 1200, 630, loadedImage);
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
  });
  it('falls back to a placeholder when the image is missing', () => {
    const ctx = mockTarget();
    drawBackground(ctx as unknown as RenderTarget, { type: 'image', src: 'x', fit: 'cover' }, 1200, 630, null);
    expect(ctx.drawImage).not.toHaveBeenCalled();
    expect(ctx.fillStyle).toBe(IMAGE_PLACEHOLDER_COLOR);
  });
  it('paints an overlay on top of the image', () => {
    const ctx = mockTarget();
    drawBackground(
      ctx as unknown as RenderTarget,
      { type: 'image', src: 'x', fit: 'fill', overlay: 'rgba(0, 0, 0, 0.5)' },
      1200,
      630,
      loadedImage,
    );
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
    expect(ctx.fillStyle).toBe('rgba(0, 0, 0, 0.5)');
  });
});

describe('renderOg', () => {
  it('renders title and subtitle text', () => {
    const ctx = mockTarget();
    renderOg(ctx as unknown as RenderTarget, createDefaultConfig());
    expect(ctx.fillText).toHaveBeenCalled();
  });
  it('renders without a subtitle', () => {
    const ctx = mockTarget();
    const config = createDefaultConfig();
    config.subtitle = null;
    renderOg(ctx as unknown as RenderTarget, config);
    expect(ctx.fillText).toHaveBeenCalled();
  });
  it('renders an image background when an image is supplied', () => {
    const ctx = mockTarget();
    const config = createDefaultConfig();
    config.background = { type: 'image', src: 'x', fit: 'cover' };
    renderOg(ctx as unknown as RenderTarget, config, loadedImage);
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
  });
});
