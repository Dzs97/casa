/**
 * Wrapper sobre @vercel/kv con fallback a memoria local.
 *
 * En desarrollo sin KV configurado, los datos viven en memoria del proceso
 * y se pierden al reiniciar el dev server. Suficiente para iterar UI.
 *
 * En producción (Vercel), las env vars KV_REST_API_URL / KV_REST_API_TOKEN
 * activan el cliente real.
 */
import { kv as vercelKV } from "@vercel/kv";

const memoryStore = new Map<string, unknown>();

const hasRealKV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

if (!hasRealKV && process.env.NODE_ENV !== "production") {
  // Solo lo anunciamos una vez por proceso
  if (!(globalThis as any).__casaKvWarned) {
    console.warn(
      "[casa] KV no configurado — usando memoria local. Define KV_REST_API_URL y KV_REST_API_TOKEN para persistir."
    );
    (globalThis as any).__casaKvWarned = true;
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (hasRealKV) {
    return (await vercelKV.get<T>(key)) ?? null;
  }
  return (memoryStore.get(key) as T) ?? null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (hasRealKV) {
    await vercelKV.set(key, value);
    return;
  }
  memoryStore.set(key, value);
}
