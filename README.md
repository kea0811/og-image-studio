# OG Image Studio

![tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

**🌐 [Live demo →](https://og-image-studio-jet.vercel.app)**

> Design Open Graph images in your browser — text, gradients, image backgrounds, and one-click PNG export.

Every link you share has a preview card. Most of them are blank, stretched, or
a hastily-cropped screenshot. OG Image Studio is a small, fast, **fully
client-side** editor that renders a pixel-perfect 1200×630 card live as you type
and exports it as a PNG in one click. No design tool, no server round-trips, no
account — your images never leave the tab.

- 🎨 Solid, **linear/radial gradient**, or **image** backgrounds (with a darken overlay)
- ✍️ Title + optional subtitle, with font, size, weight, colour and alignment
- 🧩 One-click **presets** to start from something that already looks good
- 🖼️ Auto word-wrap and vertical centering at the real 1200×630 export size
- 📋 Copy ready-to-paste `<meta>` tags for your `<head>`
- ♿ Keyboard-navigable, labelled controls and a `prefers-reduced-motion` baseline

## Run it locally

```bash
git clone https://github.com/kea0811/og-image-studio.git
cd og-image-studio
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start designing.

> Using npm or yarn? `npm install && npm run dev` / `yarn && yarn dev` work too.

## Install the renderer

The drawing logic is a framework-agnostic engine you can drop into your own
project (it only needs a Canvas2D context, so it works in the browser or in a
Node canvas / serverless OG route).

**From GitHub** (always works):

```bash
pnpm add github:kea0811/og-image-studio
```

**From npm** _(when published to npm)_:

```bash
pnpm add og-image-studio
```

## Quick example

```ts
import { createDefaultConfig, renderOg } from 'og-image-studio';

const canvas = document.querySelector('canvas')!;
canvas.width = 1200;
canvas.height = 630;
const ctx = canvas.getContext('2d')!;

const config = createDefaultConfig();
config.title.text = 'Hello, social preview';
config.subtitle = null;

renderOg(ctx, config);
// canvas now holds a finished 1200×630 card — toBlob() it and you're done.
```

Want a gradient from scratch?

```ts
import { renderOg, type OgConfig } from 'og-image-studio';

const config: OgConfig = {
  width: 1200,
  height: 630,
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
    text: 'Ship beautiful cards',
    color: '#ffffff',
    fontSize: 72,
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 700,
    lineHeight: 1.1,
    align: 'left',
  },
  subtitle: null,
};

renderOg(ctx, config);
```

## API

| Export | Description |
| --- | --- |
| `renderOg(ctx, config, image?)` | Draw a full card (background + centred text) onto a Canvas2D-like context. |
| `drawBackground(ctx, bg, w, h, image)` | Paint just the background layer (solid / gradient / image + overlay). |
| `createDefaultConfig()` | A sensible, good-looking starting `OgConfig`. |
| `listPresets()` / `getPreset(id)` | Curated starting points (`midnight`, `sunset`, `terminal`, `spotlight`). |
| `gradientToCss(gradient)` | Turn a gradient config into a CSS `background-image` string (for live preview). |
| `createCanvasGradient(ctx, g, w, h)` | Build a `CanvasGradient` from a gradient config. |
| `wrapText(measure, text, maxWidth)` | Greedy word-wrap using a canvas measurer. |
| `canvasToBlob(canvas)` / `exportCanvasAsPng(canvas, title)` | Encode and download a canvas as PNG. |
| `readableTextColor(bg)` / `withAlpha(hex, a)` | Small colour helpers (WCAG-aware contrast, rgba). |

Everything is fully typed — `OgConfig`, `Background`, `TextLayer`, `Preset` and
friends are exported from the package root.

### Drawing onto an image background

`renderOg` accepts an optional resolved image so it stays synchronous and
testable. Load the image first, then hand it over:

```ts
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => {
  renderOg(ctx, config, { source: img, width: img.naturalWidth, height: img.naturalHeight });
};
img.src = '/photo.jpg';
```

## Tech

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS · the
Canvas API. Tests run on Vitest at **100% coverage** across statements, branches,
functions and lines.

```bash
pnpm test            # run the suite
pnpm test:coverage   # run with coverage thresholds
pnpm build           # production build
```

## Contributing

Issues and PRs are welcome. Keep the engine framework-agnostic, keep the tests
green, and keep coverage at 100% (`pnpm test:coverage`).

## License

[MIT](./LICENSE) © 2026 kea0811
