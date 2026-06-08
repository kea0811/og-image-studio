import { describe, expect, it } from 'vitest';
import { ENGINE_NAME } from './index';

// Placeholder test so `pnpm test` runs green on the scaffold commit.
// Real engine tests replace this once the implementation lands.
describe('scaffold', () => {
  it('exposes the engine name', () => {
    expect(ENGINE_NAME).toBe('og-image-studio');
  });
});
