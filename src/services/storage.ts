const STORAGE_ERROR_EVENT = 'webfit:storage-error';

export interface StorageErrorDetail {
  operation: 'read' | 'write';
  key: string;
  message: string;
}

const reportStorageError = (detail: StorageErrorDetail) => {
  console.error(`[WebFit storage] ${detail.operation} failed for ${detail.key}: ${detail.message}`);
  window.dispatchEvent(new CustomEvent<StorageErrorDetail>(STORAGE_ERROR_EVENT, { detail }));
};

export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    reportStorageError({
      operation: 'read',
      key,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return fallback;
  }
};

export const readStringStorage = <T extends string>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return (raw.startsWith('"') ? JSON.parse(raw) : raw) as T;
  } catch (error) {
    reportStorageError({
      operation: 'read',
      key,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return fallback;
  }
};

export const writeStorage = <T>(key: string, value: T): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    reportStorageError({
      operation: 'write',
      key,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
    return false;
  }
};

export const storageErrorEvent = STORAGE_ERROR_EVENT;
