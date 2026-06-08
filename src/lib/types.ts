// Shared types for the og-image-studio rendering engine.
// This module is types-only (no runtime), so it is excluded from coverage.

/** A solid, single-colour background. */
export interface SolidBackground {
  type: 'solid';
  color: string;
}

/** One colour stop in a gradient, with an offset in the 0..1 range. */
export interface GradientStop {
  color: string;
  offset: number;
}

/** A linear or radial gradient background. */
export interface GradientBackground {
  type: 'gradient';
  variant: 'linear' | 'radial';
  /** Angle in degrees, CSS-style (0 = pointing up). Used for linear gradients. */
  angle: number;
  stops: GradientStop[];
}

/** How an image background fills the frame. */
export type ImageFit = 'cover' | 'contain' | 'fill';

/** An image background, optionally darkened by an overlay colour. */
export interface ImageBackground {
  type: 'image';
  src: string;
  fit: ImageFit;
  /** Optional rgba/hex overlay painted on top of the image. */
  overlay?: string;
}

export type Background = SolidBackground | GradientBackground | ImageBackground;

export type TextAlign = 'left' | 'center' | 'right';

/** A single styled run of text (the title or the subtitle). */
export interface TextLayer {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  /** Multiplier applied to fontSize to get the line box height. */
  lineHeight: number;
  align: TextAlign;
}

/** A fully described Open Graph card. */
export interface OgConfig {
  width: number;
  height: number;
  padding: number;
  background: Background;
  title: TextLayer;
  subtitle: TextLayer | null;
}

/** A named, ready-to-use starting point. */
export interface Preset {
  id: string;
  name: string;
  config: OgConfig;
}

/** An image resolved to something the canvas can draw. */
export interface LoadedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
}

/** The minimal surface of CanvasRenderingContext2D the engine relies on. */
export interface RenderTarget {
  fillStyle: string | CanvasGradient | CanvasPattern;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  fillRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number): void;
  measureText(text: string): { width: number };
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number,
  ): CanvasGradient;
}
