// Rate limit in-memory sederhana (per instance).
// Untuk single-instance deployment sesuai docker-compose. Jika scale
// horizontal, ganti dengan store eksternal (mis. Redis/DB).
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) {
    const oldest = [...hits.keys()].slice(0, 1000);
    for (const k of oldest) hits.delete(k);
  }
  return true;
}
