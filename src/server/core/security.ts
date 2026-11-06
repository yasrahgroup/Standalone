/**
 * Core Security Utilities
 * - Trusted client IP extraction (RFC 7239 / Vercel / Cloudflare safe)
 * - Exact hostname CORS validation (prevents localhost.evil.com and wildcard vercel.app bypasses)
 */

/**
 * Extract trusted client IP from HTTP Request headers.
 * Safe proxy resolution hierarchy:
 * 1. x-vercel-forwarded-for: Trusted single IP added by Vercel's edge proxy
 * 2. x-real-ip: Standard trusted proxy header
 * 3. cf-connecting-ip: Trusted edge client IP if running behind Cloudflare
 * 4. Rightmost entry of x-forwarded-for: Leftmost is client-spoofable; rightmost is appended by trusted edge
 * 5. Fallback: '127.0.0.1'
 */
export function extractClientIp(request: Request): string {
  const headers = request.headers;

  const vercelIp = headers.get('x-vercel-forwarded-for');
  if (vercelIp) return normalizeIp(vercelIp);

  const realIp = headers.get('x-real-ip');
  if (realIp) return normalizeIp(realIp);

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return normalizeIp(cfIp);

  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      // Rightmost hop is appended by the nearest trusted edge proxy
      return normalizeIp(parts[parts.length - 1]);
    }
  }

  return '127.0.0.1';
}

/**
 * Normalize an IP string: strip port, brackets, and IPv6-mapped IPv4 prefixes.
 */
export function normalizeIp(ip: string): string {
  let cleaned = ip.trim();

  // Strip brackets if IPv6 bracketed: [::1]:port or [::1]
  if (cleaned.startsWith('[') && cleaned.includes(']')) {
    cleaned = cleaned.slice(1, cleaned.indexOf(']'));
  } else if (cleaned.includes(':') && cleaned.split(':').length === 2 && !cleaned.includes('::')) {
    // IPv4 with port: 192.168.1.1:8080
    cleaned = cleaned.split(':')[0];
  }

  // Strip IPv4-mapped IPv6 prefix: ::ffff:192.168.1.1
  if (cleaned.startsWith('::ffff:')) {
    cleaned = cleaned.slice(7);
  }

  return cleaned || '127.0.0.1';
}

/**
 * Validate origin for CORS with exact hostname and environment rules.
 * Does NOT permit substring matching (which would allow attacker domains like localhost.evil.com).
 */
export function isAllowedOrigin(origin: string | null, allowedOrigins: (string | undefined)[]): boolean {
  if (!origin) return false;

  const cleanAllowed = allowedOrigins.filter(Boolean) as string[];

  // 1. Exact match against authorized origins list
  if (cleanAllowed.includes(origin)) {
    return true;
  }

  // 2. Development-only exact loopback validation
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    try {
      const parsed = new URL(origin);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        const hostname = parsed.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]') {
          return true;
        }
      }
    } catch {
      return false;
    }
  }

  return false;
}

