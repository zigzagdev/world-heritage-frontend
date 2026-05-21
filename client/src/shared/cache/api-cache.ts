type Entry<T> = { data: T; at: number };

const store = new Map<string, Entry<unknown>>();

export function getCached<T>(key: string, maxAgeMs: number): T | null {
  const entry = store.get(key) as Entry<T> | undefined;
  if (!entry || Date.now() - entry.at > maxAgeMs) return null;
  return entry.data;
}

export function setCached<T>(key: string, data: T): void {
  store.set(key, { data, at: Date.now() });
}
