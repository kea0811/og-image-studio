import { describe, expect, it } from 'vitest';
import { clamp, round } from './util';

describe('clamp', () => {
  it('returns the min when below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it('returns the max when above range', () => {
    expect(clamp(20, 0, 10)).toBe(10);
  });
  it('returns the value when inside range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

describe('round', () => {
  it('rounds to a whole number by default', () => {
    expect(round(3.7)).toBe(4);
  });
  it('rounds to the requested number of places', () => {
    expect(round(3.14159, 2)).toBe(3.14);
  });
});
