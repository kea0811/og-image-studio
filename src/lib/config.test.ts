import { describe, expect, it } from 'vitest';
import { FONT_OPTIONS, OG_HEIGHT, OG_WIDTH, createDefaultConfig } from './config';

describe('createDefaultConfig', () => {
  it('produces a standard 1200x630 card', () => {
    const config = createDefaultConfig();
    expect(config.width).toBe(OG_WIDTH);
    expect(config.height).toBe(OG_HEIGHT);
    expect(OG_WIDTH).toBe(1200);
    expect(OG_HEIGHT).toBe(630);
  });
  it('includes a title, subtitle and gradient background', () => {
    const config = createDefaultConfig();
    expect(config.title.text.length).toBeGreaterThan(0);
    expect(config.subtitle).not.toBeNull();
    expect(config.background.type).toBe('gradient');
  });
  it('returns a fresh object on every call', () => {
    expect(createDefaultConfig()).not.toBe(createDefaultConfig());
  });
});

describe('FONT_OPTIONS', () => {
  it('offers at least one font, defaulting to Inter', () => {
    expect(FONT_OPTIONS.length).toBeGreaterThan(0);
    expect(FONT_OPTIONS[0].value).toContain('Inter');
  });
});
