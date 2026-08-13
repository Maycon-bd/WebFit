import { describe, expect, it, vi } from 'vitest';
import { readStorage, readStringStorage, storageErrorEvent, writeStorage } from './storage';

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

  it('returns fallbacks when keys do not exist', () => {
    expect(readStorage('missing-json', { safe: true })).toEqual({ safe: true });
    expect(readStringStorage('missing-string', 'light')).toBe('light');
  });

  it('reads JSON encoded strings', () => {
    window.localStorage.setItem('theme', JSON.stringify('oled'));
    expect(readStringStorage('theme', 'light')).toBe('oled');
  });

  it('reports write failures without crashing the application', () => {
    const quotaError = new Error('Quota exceeded');
    quotaError.name = 'QuotaExceededError';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw quotaError;
    });
    const eventSpy = vi.fn();
    window.addEventListener(storageErrorEvent, eventSpy);

    expect(writeStorage('patient', { id: '1' })).toBe(false);
    expect(eventSpy).toHaveBeenCalledOnce();
    expect((eventSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
      operation: 'write',
      key: 'patient',
      message: 'Quota exceeded',
    });

    window.removeEventListener(storageErrorEvent, eventSpy);
    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('reports malformed encoded strings', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const eventSpy = vi.fn();
    window.addEventListener(storageErrorEvent, eventSpy);
    window.localStorage.setItem('theme', '"unterminated');

    expect(readStringStorage('theme', 'light')).toBe('light');
    expect((eventSpy.mock.calls[0][0] as CustomEvent).detail.operation).toBe('read');

    window.removeEventListener(storageErrorEvent, eventSpy);
    consoleSpy.mockRestore();
  });

  it('uses a safe message for non-Error storage failures', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw 'storage unavailable';
    });
    const eventSpy = vi.fn();
    window.addEventListener(storageErrorEvent, eventSpy);

    expect(readStorage('patient', null)).toBeNull();
    expect((eventSpy.mock.calls[0][0] as CustomEvent).detail.message).toBe('Erro desconhecido');

    window.removeEventListener(storageErrorEvent, eventSpy);
    consoleSpy.mockRestore();
  });
});
