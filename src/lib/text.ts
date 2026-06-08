export interface TextMeasurer {
  measureText(text: string): { width: number };
}

/**
 * Greedy word-wrap: split `text` into lines that each fit within `maxWidth`,
 * measured with the supplied canvas-like `measure`. A single word that is
 * wider than `maxWidth` is kept on its own line rather than dropped.
 */
export function wrapText(measure: TextMeasurer, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [];
  }
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (measure.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}
