type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { ok: false, remaining: 0 };
  b.count += 1;
  buckets.set(key, b);
  return { ok: true, remaining: limit - b.count };
}

export function getIpFromRequest(req: Request) {
  // Vercel header
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  return ip || "unknown";
}

export function hashIp(ip: string) {
  // MVP: keine echte Hashfunktion nötig, aber wir speichern IP nicht raw
  // (wenn du willst, mach ich später crypto sha256)
  return `ip_${ip.replaceAll(".", "_")}`;
}
