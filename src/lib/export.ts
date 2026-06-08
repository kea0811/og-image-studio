/** Turn arbitrary text into a safe, lowercase filename slug. */
export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'og-image';
}

/** Promise wrapper around `canvas.toBlob` that rejects when encoding fails. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas could not be exported to an image.'));
        }
      },
      type,
      quality,
    );
  });
}

/** Trigger a browser download for a Blob under `filename`. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Export a canvas to a PNG download named after `title`. */
export async function exportCanvasAsPng(canvas: HTMLCanvasElement, title: string): Promise<void> {
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `${slugify(title)}.png`);
}
