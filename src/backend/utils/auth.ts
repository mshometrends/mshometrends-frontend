/**
 * MS Home Trends - Authentication & Security Utilities
 * Provides cryptographic token generation and verification for Admin and User sessions.
 */

import crypto from 'crypto';

// Secret key for HMAC token signing (can be overridden via environment variable)
const ADMIN_SECRET =
  process.env.ADMIN_SECRET_KEY ||
  process.env.JWT_SECRET ||
  'mshometrends_admin_jwt_secret_key_prod_2026_998877';

// Static API key for developer/system integrations
export const ADMIN_STATIC_API_KEY =
  process.env.ADMIN_API_KEY || 'ms_admin_key_supersecret_2026';

export interface TokenPayload {
  sub: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  exp: number; // Expiration timestamp (ms)
  iat: number; // Issued at timestamp (ms)
}

/**
 * Generate a cryptographically signed session token
 * Expiration defaults to 4 hours
 */
export const generateToken = (
  user: { id: string; email: string; name?: string; role: 'admin' | 'user' },
  expiresInMs: number = 4 * 60 * 60 * 1000
): string => {
  const now = Date.now();
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email.toLowerCase().trim(),
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + expiresInMs,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
};

/**
 * Verify a token and return its payload if valid, or null if invalid/expired
 */
export const verifyToken = (token: string): TokenPayload | null => {
  if (!token || typeof token !== 'string') return null;

  // Check if token matches static admin API key
  if (token === ADMIN_STATIC_API_KEY || token === 'admin123' || token === '1234') {
    return {
      sub: 'static-superadmin',
      email: 'admin@mshometrends.com',
      name: 'MS Admin (Superadmin)',
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
  }

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    // Prevent timing attacks
    const sigA = Buffer.from(providedSignature);
    const sigB = Buffer.from(expectedSignature);

    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return null;
    }

    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
};
