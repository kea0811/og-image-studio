import { clamp } from './util';

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** True when `value` is a 3- or 6-digit hex colour like `#fff` or `#1e293b`. */
export function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value);
}

/**
 * Normalise a hex colour to lowercase 6-digit form (`#abc` -> `#aabbcc`).
 * Throws on anything that is not a valid hex colour.
 */
export function normalizeHex(value: string): string {
  if (!isValidHex(value)) {
    throw new Error(`Invalid hex color: ${value}`);
  }
  let hex = value.slice(1).toLowerCase();
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return `#${hex}`;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse a hex colour into its red/green/blue components (0..255). */
export function hexToRgb(value: string): Rgb {
  const hex = normalizeHex(value).slice(1);
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

/** Build an `rgba(...)` string from a hex colour and a 0..1 alpha. */
export function withAlpha(value: string, alpha: number): string {
  const { r, g, b } = hexToRgb(value);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

/** WCAG relative luminance of a hex colour, in the 0..1 range. */
export function relativeLuminance(value: string): number {
  const { r, g, b } = hexToRgb(value);
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** Pick black or white text for the best contrast against `background`. */
export function readableTextColor(background: string): '#000000' | '#ffffff' {
  return relativeLuminance(background) > 0.179 ? '#000000' : '#ffffff';
}
