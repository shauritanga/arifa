/**
 * Fixed-window, in-memory rate limit for the public form endpoints.
 *
 * The site runs as a single long-lived Node process on a VPS, so a module-level
 * Map is a real limit rather than a decorative one. It is not shared state — if
 * the app is ever scaled to multiple instances, this must move to Redis or the
 * database, otherwise the effective limit multiplies by the instance count.
 *
 * This exists to blunt spam and accidental double-submits, not to stop a
 * determined attacker.
 */

const hits = new Map();

/** Evict expired windows so the Map can't grow without bound. */
function sweep(now) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

/**
 * Returns true when the caller is over budget.
 * @param {string} key    caller identity (usually the client IP)
 * @param {number} limit  requests allowed per window
 * @param {number} windowMs window length in ms
 */
export function isRateLimited(key, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  if (hits.size > 5000) sweep(now);

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

/**
 * Best-effort client IP. Behind a reverse proxy (nginx/Caddy on the VPS) the
 * real address arrives in x-forwarded-for; the left-most entry is the client.
 */
export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
