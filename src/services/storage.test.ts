import { describe, expect, it, vi } from 'vitest';
import { readStorage, readStringStorage, writeStorage } from './storage';

describe('storage service', () => {
  it('writes and restores JSON values', () => {
    expect(writeStorage('patient', { id: '1', name: 'Ana' })).toBe(true);
    expect(readStorage('patient', null)).toEqual({ id: '1', name: 'Ana' });
  });

  it('falls back when persisted JSON is corrupted', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.localStorage.setItem('patient', '{invalid');

    expect(readStorage('patient', { safe: true })).toEqual({ safe: true });
    consoleSpy.mockRestore();
  });

  it('migrates legacy raw strings', () => {
    window.localStorage.setItem('theme', 'midnight');
    expect(readStringStorage('theme', 'light')).toBe('midnight');
  });
});
