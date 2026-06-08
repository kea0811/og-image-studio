import type { Preset } from './types';
import { FONT_OPTIONS, OG_HEIGHT, OG_WIDTH } from './config';

const SANS = FONT_OPTIONS[0].value;
const SERIF = FONT_OPTIONS[1].value;
const MONO = FONT_OPTIONS[2].value;

/** Curated starting points users can load with one click. */
export const presets: Preset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    config: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: 80,
      background: {
        type: 'gradient',
        variant: 'linear',
        angle: 135,
        stops: [
          { color: '#0f172a', offset: 0 },
          { color: '#1e3a8a', offset: 1 },
        ],
      },
      title: {
        text: 'Announcing something new',
        color: '#f8fafc',
        fontSize: 76,
        fontFamily: SANS,
        fontWeight: 700,
        lineHeight: 1.1,
        align: 'left',
      },
      subtitle: {
        text: 'A short, punchy subtitle goes right here.',
        color: '#cbd5e1',
        fontSize: 34,
        fontFamily: SANS,
        fontWeight: 400,
        lineHeight: 1.3,
        align: 'left',
      },
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    config: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: 90,
      background: {
        type: 'gradient',
        variant: 'linear',
        angle: 110,
        stops: [
          { color: '#f97316', offset: 0 },
          { color: '#db2777', offset: 0.55 },
          { color: '#7c3aed', offset: 1 },
        ],
      },
      title: {
        text: 'Warm headlines that pop',
        color: '#ffffff',
        fontSize: 80,
        fontFamily: SERIF,
        fontWeight: 700,
        lineHeight: 1.05,
        align: 'left',
      },
      subtitle: {
        text: 'Serif type over a sunset gradient.',
        color: '#fde68a',
        fontSize: 32,
        fontFamily: SERIF,
        fontWeight: 400,
        lineHeight: 1.3,
        align: 'left',
      },
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    config: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: 96,
      background: { type: 'solid', color: '#0a0a0a' },
      title: {
        text: '$ ship --fast',
        color: '#4ade80',
        fontSize: 72,
        fontFamily: MONO,
        fontWeight: 700,
        lineHeight: 1.2,
        align: 'left',
      },
      subtitle: {
        text: '// for changelogs, docs and dev tools',
        color: '#94a3b8',
        fontSize: 30,
        fontFamily: MONO,
        fontWeight: 400,
        lineHeight: 1.4,
        align: 'left',
      },
    },
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    config: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      padding: 100,
      background: {
        type: 'gradient',
        variant: 'radial',
        angle: 0,
        stops: [
          { color: '#334155', offset: 0 },
          { color: '#0f172a', offset: 1 },
        ],
      },
      title: {
        text: 'Centered and calm',
        color: '#ffffff',
        fontSize: 78,
        fontFamily: SANS,
        fontWeight: 700,
        lineHeight: 1.1,
        align: 'center',
      },
      subtitle: {
        text: 'A radial glow keeps the focus on your words.',
        color: '#cbd5e1',
        fontSize: 32,
        fontFamily: SANS,
        fontWeight: 400,
        lineHeight: 1.3,
        align: 'center',
      },
    },
  },
];

/** Look up a preset by id. */
export function getPreset(id: string): Preset | undefined {
  return presets.find((preset) => preset.id === id);
}

/** All presets, in display order. */
export function listPresets(): Preset[] {
  return presets;
}
