import { describe, expect, it } from 'vitest';
import { wrapText } from './text';

// Each character is 10px wide under this measurer.
const measure = { measureText: (text: string) => ({ width: text.length * 10 }) };

describe('wrapText', () => {
  it('returns an empty array for blank input', () => {
    expect(wrapText(measure, '   ', 100)).toEqual([]);
  });
  it('keeps text on one line when it fits', () => {
    expect(wrapText(measure, 'hi there', 1000)).toEqual(['hi there']);
  });
  it('wraps to a new line when the next word does not fit', () => {
    expect(wrapText(measure, 'aaaa bbbb cccc', 90)).toEqual(['aaaa bbbb', 'cccc']);
  });
  it('keeps an over-long single word on its own line', () => {
    expect(wrapText(measure, 'superlongword', 10)).toEqual(['superlongword']);
  });
});
