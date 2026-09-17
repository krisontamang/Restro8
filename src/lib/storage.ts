let storageError: string | null = null;
const subscribers = new Set<() => void>();
function reportFailure() {
  storageError = 'Changes cannot be saved in this browser. Keep this tab open and allow browser storage or free up space before continuing.';
  subscribers.forEach(notify => notify());
}
export const subscribeStorage = (notify: () => void) => { subscribers.add(notify); return () => { subscribers.delete(notify); }; };
export const getStorageError = () => storageError;

/** Storage failures must never crash the restaurant workspace or silently claim success. */
export const safeStorage = {
  getItem(key: string) { try { return localStorage.getItem(key); } catch { reportFailure(); return null; } },
  setItem(key: string, value: string) { try { if (localStorage.getItem(key) !== value) localStorage.setItem(key, value); return true; } catch { reportFailure(); return false; } },
  removeItem(key: string) { try { localStorage.removeItem(key); return true; } catch { reportFailure(); return false; } },
};

export function readStored<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  const raw = safeStorage.getItem(key);
  if (!raw) return fallback;
  try { const value: unknown = JSON.parse(raw); if (validate(value)) return value; } catch { /* Preserve the original below for recovery. */ }
  if (!safeStorage.setItem(`${key}.recovery`, raw)) reportFailure();
  return fallback;
}
