import { describe, expect, it, vi } from 'vitest';
import { angleToLine, createCanvasGradient, gradientToCss, sortStops } from './gradient';
import type { GradientBackground, RenderTarget } from './types';

const linear: GradientBackground = {
  type: 'gradient',
  variant: 'linear',
  angle: 90,
  stops: [
    { color: '#fff', offset: 1 },
    { color: '#000', offset: 0 },
  ],
};

const radial: GradientBackground = {
  type: 'gradient',
  variant: 'radial',
  angle: 0,
  stops: [
    { color: '#000', offset: 0 },
    { color: '#fff', offset: 1 },
  ],
};

function mockTarget() {
  const gradient = { addColorStop: vi.fn() } as unknown as CanvasGradient;
  return {
    gradient,
    addColorStop: gradient.addColorStop as ReturnType<typeof vi.fn>,
    createLinearGradient: vi.fn(() => gradient),
    createRadialGradient: vi.fn(() => gradient),
  };
}

describe('sortStops', () => {
  it('orders by offset without mutating the input', () => {
    const stops = [
      { color: 'a', offset: 1 },
      { color: 'b', offset: 0 },
    ];
    expect(sortStops(stops).map((s) => s.color)).toEqual(['b', 'a']);
    expect(stops[0].color).toBe('a');
  });
});

describe('gradientToCss', () => {
  it('renders a linear gradient with its angle', () => {
    expect(gradientToCss(linear)).toBe('linear-gradient(90deg, #000 0%, #fff 100%)');
  });
  it('renders a radial gradient', () => {
    expect(gradientToCss(radial)).toBe('radial-gradient(circle at center, #000 0%, #fff 100%)');
  });
  it('clamps out-of-range offsets to 0..100%', () => {
    const g: GradientBackground = {
      type: 'gradient',
      variant: 'linear',
      angle: 0,
      stops: [
        { color: '#000', offset: -1 },
        { color: '#fff', offset: 2 },
      ],
    };
    expect(gradientToCss(g)).toBe('linear-gradient(0deg, #000 0%, #fff 100%)');
  });
});

describe('angleToLine', () => {
  it('0deg draws a vertical line through the centre', () => {
    const [x0, y0, x1, y1] = angleToLine(0, 100, 200);
    expect(x0).toBeCloseTo(50);
    expect(x1).toBeCloseTo(50);
    expect(y0).toBeCloseTo(200);
    expect(y1).toBeCloseTo(0);
  });
  it('90deg draws a horizontal line through the centre', () => {
    const [x0, y0, x1, y1] = angleToLine(90, 100, 200);
    expect(y0).toBeCloseTo(100);
    expect(y1).toBeCloseTo(100);
    expect(x0).toBeCloseTo(0);
    expect(x1).toBeCloseTo(100);
  });
});

describe('createCanvasGradient', () => {
  it('builds a linear gradient and adds every stop', () => {
    const ctx = mockTarget();
    const result = createCanvasGradient(ctx as unknown as RenderTarget, linear, 100, 200);
    expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
    expect(ctx.addColorStop).toHaveBeenCalledTimes(2);
    expect(result).toBe(ctx.gradient);
  });
  it('builds a radial gradient', () => {
    const ctx = mockTarget();
    createCanvasGradient(ctx as unknown as RenderTarget, radial, 100, 200);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(1);
  });
  it('clamps stop offsets passed to the canvas', () => {
    const ctx = mockTarget();
    const g: GradientBackground = {
      type: 'gradient',
      variant: 'linear',
      angle: 0,
      stops: [{ color: '#000', offset: -1 }],
    };
    createCanvasGradient(ctx as unknown as RenderTarget, g, 10, 10);
    expect(ctx.addColorStop).toHaveBeenCalledWith(0, '#000');
  });
});
