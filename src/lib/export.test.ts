import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canvasToBlob, downloadBlob, exportCanvasAsPng, slugify } from './export';

describe('slugify', () => {
  it('lowercases, trims and dashes a title', () => {
    expect(slugify('  Hello, World!  ')).toBe('hello-world');
  });
  it('falls back to a default when nothing usable remains', () => {
    expect(slugify('!!!')).toBe('og-image');
  });
});

describe('canvasToBlob', () => {
  it('resolves with the encoded blob', async () => {
    const blob = new Blob(['x']);
    const canvas = {
      toBlob: (cb: BlobCallback) => cb(blob),
    } as unknown as HTMLCanvasElement;
    await expect(canvasToBlob(canvas, 'image/png')).resolves.toBe(blob);
  });
  it('uses image/png by default and rejects when encoding fails', async () => {
    const canvas = {
      toBlob: (cb: BlobCallback) => cb(null),
    } as unknown as HTMLCanvasElement;
    await expect(canvasToBlob(canvas)).rejects.toThrow(/could not be exported/);
  });
});

describe('downloadBlob', () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;
  let click: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    createObjectURL = vi.fn(() => 'blob:mock-url');
    revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURL as unknown as typeof URL.revokeObjectURL;
    click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    click.mockRestore();
  });

  it('creates a link, clicks it and revokes the object URL', () => {
    const blob = new Blob(['x']);
    downloadBlob(blob, 'card.png');
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(document.querySelector('a')).toBeNull();
  });
});

describe('exportCanvasAsPng', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url') as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;
  });

  it('exports a PNG named after the title', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const blob = new Blob(['x']);
    const canvas = {
      toBlob: (cb: BlobCallback) => cb(blob),
    } as unknown as HTMLCanvasElement;
    await exportCanvasAsPng(canvas, 'My Card');
    expect(click).toHaveBeenCalledTimes(1);
    click.mockRestore();
  });
});
