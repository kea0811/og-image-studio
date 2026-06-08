import { describe, expect, it } from 'vitest';
import {
  hexToRgb,
  isValidHex,
  normalizeHex,
  readableTextColor,
  relativeLuminance,
  withAlpha,
} from './color';

describe('isValidHex', () => {
  it('accepts 3- and 6-digit hex', () => {
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('#1E293B')).toBe(true);
  });
  it('rejects non-hex strings', () => {
    expect(isValidHex('red')).toBe(false);
    expect(isValidHex('#12')).toBe(false);
  });
});

describe('normalizeHex', () => {
  it('expands shorthand to 6 digits', () => {
    expect(normalizeHex('#ABC')).toBe('#aabbcc');
  });
  it('lowercases 6-digit hex', () => {
    expect(normalizeHex('#1E293B')).toBe('#1e293b');
  });
  it('throws on invalid input', () => {
    expect(() => normalizeHex('nope')).toThrow(/Invalid hex color/);
  });
});

describe('hexToRgb', () => {
  it('parses red/green/blue components', () => {
    expect(hexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 });
  });
});

describe('withAlpha', () => {
  it('builds an rgba() string', () => {
    expect(withAlpha('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });
  it('clamps alpha into 0..1', () => {
    expect(withAlpha('#ffffff', 2)).toBe('rgba(255, 255, 255, 1)');
  });
});

describe('relativeLuminance', () => {
  it('is ~0 for black and ~1 for white', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });
});

describe('readableTextColor', () => {
  it('picks black on light backgrounds', () => {
    expect(readableTextColor('#ffffff')).toBe('#000000');
  });
  it('picks white on dark backgrounds', () => {
    expect(readableTextColor('#0f172a')).toBe('#ffffff');
  });
});
