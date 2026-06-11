'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FONT_OPTIONS, createDefaultConfig } from '@/src/lib/config';
import { listPresets } from '@/src/lib/presets';
import { exportCanvasAsPng } from '@/src/lib/export';
import { withAlpha } from '@/src/lib/color';
import type {
  Background,
  GradientBackground,
  ImageBackground,
  OgConfig,
  SolidBackground,
  TextAlign,
  TextLayer,
} from '@/src/lib/types';
import { useLoadedImage } from './use-loaded-image';
import { Preview } from './Preview';
import { ColorInput, Panel, Segmented, Select, Slider, TextArea } from './ui';

const WEIGHT_OPTIONS = [
  { label: 'Regular', value: '400' },
  { label: 'Bold', value: '700' },
] as const;

const ALIGN_OPTIONS: ReadonlyArray<{ label: string; value: TextAlign }> = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const BG_OPTIONS = [
  { label: 'Solid', value: 'solid' },
  { label: 'Gradient', value: 'gradient' },
  { label: 'Image', value: 'image' },
] as const;

const FIT_OPTIONS: ReadonlyArray<{ label: string; value: ImageBackground['fit'] }> = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Fill', value: 'fill' },
];

const GRADIENT_VARIANTS: ReadonlyArray<{ label: string; value: GradientBackground['variant'] }> = [
  { label: 'Linear', value: 'linear' },
  { label: 'Radial', value: 'radial' },
];

const DEFAULT_GRADIENT: GradientBackground = {
  type: 'gradient',
  variant: 'linear',
  angle: 135,
  stops: [
    { color: '#7c3aed', offset: 0 },
    { color: '#2563eb', offset: 1 },
  ],
};

const DEFAULT_SUBTITLE: TextLayer = {
  text: 'Add a supporting line of copy here.',
  color: '#e2e8f0',
  fontSize: 34,
  fontFamily: FONT_OPTIONS[0].value,
  fontWeight: 400,
  lineHeight: 1.3,
  align: 'left',
};

function backgroundForType(type: Background['type'], current: Background): Background {
  if (type === 'solid') {
    const color = current.type === 'solid' ? current.color : '#0f172a';
    return { type: 'solid', color } satisfies SolidBackground;
  }
  if (type === 'gradient') {
    return current.type === 'gradient' ? current : DEFAULT_GRADIENT;
  }
  return current.type === 'image' ? current : { type: 'image', src: '', fit: 'cover' };
}

export function Editor() {
  const [config, setConfig] = useState<OgConfig>(() => createDefaultConfig());
  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const imageSrc = config.background.type === 'image' ? config.background.src : null;
  const image = useLoadedImage(imageSrc || null);

  const presets = useMemo(() => listPresets(), []);
  const [metaImageUrl, setMetaImageUrl] = useState('https://your-site.com/og.png');
  const [metaPageUrl, setMetaPageUrl] = useState('https://your-site.com');
  const [metaDescription, setMetaDescription] = useState('');

  const computedMetaSnippet = useMemo(() => {
    const titleText = config.title.text || '';
    const descText = metaDescription || config.subtitle?.text || '';
    const lines: string[] = [];
    lines.push('<!-- Open Graph -->');
    if (titleText) lines.push(`<meta property="og:title" content=${JSON.stringify(titleText)} />`);
    if (descText) lines.push(`<meta property="og:description" content=${JSON.stringify(descText)} />`);
    if (metaPageUrl) lines.push(`<meta property="og:url" content=${JSON.stringify(metaPageUrl)} />`);
    lines.push('<meta property="og:type" content="website" />');
    lines.push(`<meta property="og:image" content=${JSON.stringify(metaImageUrl || 'https://your-site.com/og.png')} />`);
    lines.push(`<meta property="og:image:width" content="${config.width}" />`);
    lines.push(`<meta property="og:image:height" content="${config.height}" />`);
    lines.push('');
    lines.push('<!-- Twitter / X -->');
    lines.push('<meta name="twitter:card" content="summary_large_image" />');
    if (titleText) lines.push(`<meta name="twitter:title" content=${JSON.stringify(titleText)} />`);
    if (descText) lines.push(`<meta name="twitter:description" content=${JSON.stringify(descText)} />`);
    lines.push(`<meta name="twitter:image" content=${JSON.stringify(metaImageUrl || 'https://your-site.com/og.png')} />`);
    return lines.join('\n');
  }, [config.title.text, config.subtitle, config.width, config.height, metaImageUrl, metaPageUrl, metaDescription]);

  const [metaSnippet, setMetaSnippet] = useState(computedMetaSnippet);
  useEffect(() => {
    setMetaSnippet(computedMetaSnippet);
  }, [computedMetaSnippet]);

  const updateLayer = useCallback((key: 'title' | 'subtitle', patch: Partial<TextLayer>) => {
    setConfig((current) => {
      const layer = key === 'title' ? current.title : current.subtitle;
      if (!layer) return current;
      return { ...current, [key]: { ...layer, ...patch } };
    });
  }, []);

  const updateBackground = useCallback((next: Background) => {
    setConfig((current) => ({ ...current, background: next }));
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      updateBackground({ type: 'image', src: url, fit: 'cover' });
    },
    [updateBackground],
  );

  const handleExport = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      await exportCanvasAsPng(canvas, config.title.text);
      setStatus('Saved your PNG ✓');
    } catch {
      setStatus('Export failed — an external image background can taint the canvas (needs CORS).');
    }
  }, [config.title.text]);

  const copyMeta = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(metaSnippet).then(
        () => setStatus('Meta tags copied ✓'),
        () => setStatus('Could not copy to clipboard.'),
      );
    }
  }, [metaSnippet]);

  const bg = config.background;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Preview column */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-2xl border border-white/10 bg-ink-900/40 p-3 shadow-glow">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                Preview
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {config.width} × {config.height}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyMeta}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Copy meta tags
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg bg-violet-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Download PNG
              </button>
            </div>
          </div>
          <Preview config={config} image={image} canvasRef={canvasRef} />
          <div className="mt-2 min-h-[1.25rem] px-1 text-[11px] text-slate-500" role="status" aria-live="polite">
            {status}
          </div>
        </div>
      </div>

      {/* Controls column */}
      <div className="flex flex-col gap-5">
        <Panel title="Presets">
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setConfig(structuredClone(preset.config))}
                className="rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Content">
          <TextArea
            id="title-text"
            label="Title"
            value={config.title.text}
            onChange={(text) => updateLayer('title', { text })}
          />
          <LayerStyle layer={config.title} idPrefix="title" onChange={(patch) => updateLayer('title', patch)} />

          <div className="flex items-center gap-2 pt-1">
            <input
              id="subtitle-toggle"
              type="checkbox"
              checked={config.subtitle !== null}
              onChange={(event) =>
                setConfig((current) => ({
                  ...current,
                  subtitle: event.target.checked ? DEFAULT_SUBTITLE : null,
                }))
              }
              className="h-4 w-4 rounded border-white/20 bg-ink-800 accent-violet-500"
            />
            <label htmlFor="subtitle-toggle" className="text-sm font-medium text-slate-300">
              Show subtitle
            </label>
          </div>

          {config.subtitle ? (
            <>
              <TextArea
                id="subtitle-text"
                label="Subtitle"
                value={config.subtitle.text}
                onChange={(text) => updateLayer('subtitle', { text })}
              />
              <LayerStyle
                layer={config.subtitle}
                idPrefix="subtitle"
                onChange={(patch) => updateLayer('subtitle', patch)}
              />
            </>
          ) : null}
        </Panel>

        <Panel title="Background">
          <Segmented
            label="Type"
            value={bg.type}
            options={BG_OPTIONS}
            onChange={(type) => updateBackground(backgroundForType(type, bg))}
          />

          {bg.type === 'solid' ? (
            <ColorInput
              id="bg-solid"
              label="Colour"
              value={bg.color}
              onChange={(color) => updateBackground({ type: 'solid', color })}
            />
          ) : null}

          {bg.type === 'gradient' ? (
            <GradientControls value={bg} onChange={updateBackground} />
          ) : null}

          {bg.type === 'image' ? (
            <ImageControls value={bg} onChange={updateBackground} onFile={handleFile} />
          ) : null}
        </Panel>

        <Panel title="Layout">
          <Slider
            id="padding"
            label="Padding"
            min={24}
            max={160}
            value={config.padding}
            suffix="px"
            onChange={(padding) => setConfig((current) => ({ ...current, padding }))}
          />
        </Panel>

        <Panel title="Meta tags">
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="meta-image-url" className="mb-1 block text-xs font-medium text-slate-400">
                Image URL <span className="text-slate-600">(where your og.png will live)</span>
              </label>
              <input
                id="meta-image-url"
                type="url"
                value={metaImageUrl}
                onChange={(e) => setMetaImageUrl(e.target.value)}
                placeholder="https://your-site.com/og.png"
                className="w-full rounded-lg border border-white/10 bg-ink-800/60 px-3 py-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:border-violet-400/60 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="meta-page-url" className="mb-1 block text-xs font-medium text-slate-400">
                Page URL
              </label>
              <input
                id="meta-page-url"
                type="url"
                value={metaPageUrl}
                onChange={(e) => setMetaPageUrl(e.target.value)}
                placeholder="https://your-site.com"
                className="w-full rounded-lg border border-white/10 bg-ink-800/60 px-3 py-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:border-violet-400/60 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="meta-description" className="mb-1 block text-xs font-medium text-slate-400">
                Description <span className="text-slate-600">(defaults to subtitle)</span>
              </label>
              <textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={config.subtitle?.text || 'Optional description for og:description / twitter:description'}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-ink-800/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-violet-400/60 focus:outline-none"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="meta-snippet" className="text-xs font-medium text-slate-400">
                  Preview (editable)
                </label>
                <button
                  type="button"
                  onClick={copyMeta}
                  className="rounded border border-white/10 px-2 py-1 text-[11px] font-semibold text-violet-300 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                >
                  Copy
                </button>
              </div>
              <textarea
                id="meta-snippet"
                value={metaSnippet}
                onChange={(e) => setMetaSnippet(e.target.value)}
                rows={12}
                spellCheck={false}
                className="w-full rounded-lg border border-white/10 bg-ink-950/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-slate-300 focus:border-violet-400/60 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-slate-600">
                Edit any field above to regenerate, or tweak the raw output directly. Copy uses whatever's in this box.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function LayerStyle({
  layer,
  idPrefix,
  onChange,
}: {
  layer: TextLayer;
  idPrefix: string;
  onChange: (patch: Partial<TextLayer>) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-ink-800/40 p-3">
      <Select
        id={`${idPrefix}-font`}
        label="Font"
        value={layer.fontFamily}
        options={FONT_OPTIONS}
        onChange={(fontFamily) => onChange({ fontFamily })}
      />
      <div className="grid grid-cols-2 gap-3">
        <ColorInput
          id={`${idPrefix}-color`}
          label="Colour"
          value={layer.color}
          onChange={(color) => onChange({ color })}
        />
        <Slider
          id={`${idPrefix}-size`}
          label="Size"
          min={16}
          max={120}
          value={layer.fontSize}
          suffix="px"
          onChange={(fontSize) => onChange({ fontSize })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Segmented
          label="Weight"
          value={String(layer.fontWeight) === '700' ? '700' : '400'}
          options={WEIGHT_OPTIONS}
          onChange={(weight) => onChange({ fontWeight: Number(weight) })}
        />
        <Segmented
          label="Align"
          value={layer.align}
          options={ALIGN_OPTIONS}
          onChange={(align) => onChange({ align })}
        />
      </div>
    </div>
  );
}

function GradientControls({
  value,
  onChange,
}: {
  value: GradientBackground;
  onChange: (next: GradientBackground) => void;
}) {
  const setStopColor = (index: number, color: string) => {
    const stops = value.stops.map((stop, i) => (i === index ? { ...stop, color } : stop));
    onChange({ ...value, stops });
  };
  const setStopOffset = (index: number, offset: number) => {
    const stops = value.stops.map((stop, i) => (i === index ? { ...stop, offset } : stop));
    onChange({ ...value, stops });
  };
  const addStop = () => {
    onChange({ ...value, stops: [...value.stops, { color: '#f8fafc', offset: 0.5 }] });
  };
  const removeStop = (index: number) => {
    onChange({ ...value, stops: value.stops.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        label="Style"
        value={value.variant}
        options={GRADIENT_VARIANTS}
        onChange={(variant) => onChange({ ...value, variant })}
      />
      {value.variant === 'linear' ? (
        <Slider
          id="gradient-angle"
          label="Angle"
          min={0}
          max={360}
          value={value.angle}
          suffix="°"
          onChange={(angle) => onChange({ ...value, angle })}
        />
      ) : null}

      <div className="flex flex-col gap-3">
        {value.stops.map((stop, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1">
              <ColorInput
                id={`stop-${index}`}
                label={`Stop ${index + 1}`}
                value={stop.color}
                onChange={(color) => setStopColor(index, color)}
              />
            </div>
            <div className="flex-1">
              <Slider
                id={`stop-offset-${index}`}
                label="Position"
                min={0}
                max={100}
                value={Math.round(stop.offset * 100)}
                suffix="%"
                onChange={(percent) => setStopOffset(index, percent / 100)}
              />
            </div>
            {value.stops.length > 2 ? (
              <button
                type="button"
                aria-label={`Remove stop ${index + 1}`}
                onClick={() => removeStop(index)}
                className="mb-1 h-9 w-9 shrink-0 rounded-lg border border-white/10 text-slate-400 transition hover:border-rose-400/50 hover:text-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          onClick={addStop}
          className="self-start rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-violet-400/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
        >
          + Add colour stop
        </button>
      </div>
    </div>
  );
}

function ImageControls({
  value,
  onChange,
  onFile,
}: {
  value: ImageBackground;
  onChange: (next: ImageBackground) => void;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="image-file" className="text-sm font-medium text-slate-300">
          Upload image
        </label>
        <input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={(event) => onFile(event.target.files?.[0])}
          className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-400"
        />
      </div>
      <Segmented
        label="Fit"
        value={value.fit}
        options={FIT_OPTIONS}
        onChange={(fit) => onChange({ ...value, fit })}
      />
      <Slider
        id="image-darken"
        label="Darken"
        min={0}
        max={80}
        value={overlayValueToPercent(value.overlay)}
        suffix="%"
        onChange={(percent) =>
          onChange({ ...value, overlay: percent > 0 ? withAlpha('#000000', percent / 100) : undefined })
        }
      />
      {value.src ? null : (
        <p className="text-xs text-slate-500">Pick an image to see it in the preview.</p>
      )}
    </div>
  );
}

function overlayValueToPercent(overlay: string | undefined): number {
  if (!overlay) return 0;
  const match = /([\d.]+)\)\s*$/.exec(overlay);
  return match ? Math.round(Number(match[1]) * 100) : 0;
}
