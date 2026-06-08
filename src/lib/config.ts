import type { OgConfig } from './types';

/** Standard Open Graph image dimensions (also Twitter `summary_large_image`). */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Font stacks offered in the editor. The first entry is the default. */
export const FONT_OPTIONS = [
  { label: 'Inter / System', value: 'Inter, system-ui, sans-serif' },
  { label: 'Georgia / Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Menlo / Mono', value: 'Menlo, "SF Mono", ui-monospace, monospace' },
] as const;

/** A sensible, good-looking starting card. */
export function createDefaultConfig(): OgConfig {
  return {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    padding: 80,
    background: {
      type: 'gradient',
      variant: 'linear',
      angle: 135,
      stops: [
        { color: '#7c3aed', offset: 0 },
        { color: '#2563eb', offset: 1 },
      ],
    },
    title: {
      text: 'Ship beautiful social cards',
      color: '#ffffff',
      fontSize: 72,
      fontFamily: FONT_OPTIONS[0].value,
      fontWeight: 700,
      lineHeight: 1.1,
      align: 'left',
    },
    subtitle: {
      text: 'Design, preview and export Open Graph images in seconds.',
      color: '#e2e8f0',
      fontSize: 34,
      fontFamily: FONT_OPTIONS[0].value,
      fontWeight: 400,
      lineHeight: 1.3,
      align: 'left',
    },
  };
}
