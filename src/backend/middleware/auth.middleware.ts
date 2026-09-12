/**
 * MS Home Trends - Admin & User Authentication Middleware
 * Protects administrative and private endpoints against unauthorized public access.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/auth.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  adminUser?: TokenPayload;
}

/**
 * Helper to extract token from standard HTTP headers or query parameters
 */
export const extractTokenFromRequest = (req: Request): string | null => {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers.authorization || (req.headers as any)['Authorization'];
  if (typeof authHeader === 'string' && authHeader.trim().startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check x-admin-key or x-admin-token headers
  const adminHeader = req.headers['x-admin-key'] || req.headers['x-admin-token'];
  if (typeof adminHeader === 'string' && adminHeader.trim()) {
    return adminHeader.trim();
  }

  // 3. Fallback check for query parameter ?admin_key=<token> or ?token=<token>
  if (typeof req.query.admin_key === 'string' && req.query.admin_key.trim()) {
    return req.query.admin_key.trim();
  }
  if (typeof req.query.token === 'string' && req.query.token.trim()) {
    return req.query.token.trim();
  }

  return null;
};

/**
 * Middleware: Strictly requires valid ADMIN authentication.
 * Returns 401 Unauthorized if token is missing or invalid.
 * Returns 403 Forbidden if token belongs to non-admin user.
 */
export const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = extractTokenFromRequest(req);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access Denied: Admin authentication required. Please provide a valid Authorization Bearer token or x-admin-key header.',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Access Denied: Invalid or expired admin authentication session. Please log in again.',
    });
    return;
  }

  if (payload.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access Denied: Superadmin privileges required to access this resource.',
    });
    return;
  }

  // Attach verified admin details to request
  req.user = payload;
  req.adminUser = payload;
  next();
};

/**
 * Middleware: Requires a valid logged-in user (admin or regular user)
 */
export const requireUserAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = extractTokenFromRequest(req);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to your account.',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.',
    });
    return;
  }

  req.user = payload;
  next();
};
