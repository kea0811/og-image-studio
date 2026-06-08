import { describe, expect, it } from 'vitest';
import { getPreset, listPresets, presets } from './presets';

describe('presets', () => {
  it('lists every preset', () => {
    expect(listPresets()).toBe(presets);
    expect(presets.length).toBeGreaterThanOrEqual(4);
  });
  it('looks up a preset by id', () => {
    expect(getPreset('midnight')?.name).toBe('Midnight');
  });
  it('returns undefined for an unknown id', () => {
    expect(getPreset('does-not-exist')).toBeUndefined();
  });
  it('every preset targets the standard OG size', () => {
    for (const preset of presets) {
      expect(preset.config.width).toBe(1200);
      expect(preset.config.height).toBe(630);
    }
  });
});
