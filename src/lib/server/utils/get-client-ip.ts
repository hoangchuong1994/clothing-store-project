/**
 * Utility to extract client IP from request
 * Used for rate limiting and audit logging
 */

/**
 * Extract client IP address from request
 * Handles forwarded IPs from proxies/CDN
 */
export function getClientIp(request?: Request): string {
  if (!request) {
    return 'unknown';
  }

  // Try to get from forwarded headers (proxies, CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = forwarded.split(',');
    return ips[0]?.trim() || 'unknown';
  }

  // Try Vercel's client IP header
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp;
  }

  // Try Cloudflare
  const cloudflareIp = request.headers.get('cf-connecting-ip');
  if (cloudflareIp) {
    return cloudflareIp;
  }

  // Fallback to direct connection (usually localhost in development)
  return 'unknown';
}

/**
 * Anonymize IP for logging (keep first 2 octets for IPv4)
 */
export function anonymizeIp(ip: string): string {
  if (ip === 'unknown') return 'unknown';

  const parts = ip.split('.');
  if (parts.length === 4) {
    // IPv4: keep first 2 octets
    return `${parts[0]}.${parts[1]}.0.0`;
  }

  if (ip.includes(':')) {
    // IPv6: keep first 3 segments
    const segments = ip.split(':');
    return `${segments[0]}:${segments[1]}:${segments[2]}:****`;
  }

  return ip;
}

/**
 * Check if IP is from localhost/development
 */
export function isLocalhost(ip: string): boolean {
  return ip === 'localhost' || ip === '127.0.0.1' || ip === '::1' || ip === 'unknown';
}
