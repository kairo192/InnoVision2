import { Request, Response, NextFunction } from 'express';
import { env } from '../env';

// Rate limiting storage (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const failedLoginAttempts = new Map<string, { count: number; blockedUntil: number }>();

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'InnoVision School');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self';");
  
  if (env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // CORS headers
  const allowedOrigins = env.NODE_ENV === 'production' 
    ? [process.env.PRODUCTION_DOMAIN || 'https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];
    
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

// Enhanced rate limiter with different limits for different endpoints
export function rateLimiter(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const key = `${clientId}:${Math.floor(now / windowMs)}`;
    
    const limit = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (limit.count >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((limit.resetTime - now) / 1000)
      });
    }
    
    limit.count++;
    rateLimitStore.set(key, limit);
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      cleanupRateLimitStore();
    }
    
    next();
  };
}

// Strict rate limiter for login attempts
export function loginRateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientId = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = failedLoginAttempts.get(clientId);
  
  if (attempt && attempt.blockedUntil > now) {
    const remainingTime = Math.ceil((attempt.blockedUntil - now) / 1000);
    return res.status(429).json({
      message: 'Too many failed login attempts. Please try again later.',
      retryAfter: remainingTime
    });
  }
  
  next();
}

// Track failed login attempts
export function trackFailedLogin(ip: string) {
  const clientId = ip || 'unknown';
  const now = Date.now();
  const attempt = failedLoginAttempts.get(clientId) || { count: 0, blockedUntil: 0 };
  
  attempt.count++;
  
  if (attempt.count >= 5) {
    // Block for 15 minutes after 5 failed attempts
    attempt.blockedUntil = now + (15 * 60 * 1000);
  } else if (attempt.count >= 3) {
    // Block for 5 minutes after 3 failed attempts
    attempt.blockedUntil = now + (5 * 60 * 1000);
  }
  
  failedLoginAttempts.set(clientId, attempt);
}

// Reset failed login attempts on successful login
export function resetFailedLogin(ip: string) {
  const clientId = ip || 'unknown';
  failedLoginAttempts.delete(clientId);
}

// Input validation and sanitization
export function validateInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize and validate common inputs
  if (req.body) {
    // Remove any potentially dangerous characters
    const sanitizeString = (str: string) => {
      if (typeof str !== 'string') return str;
      return str.replace(/[<>"'&]/g, '');
    };
    
    // Recursively sanitize object
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      }
      if (typeof obj === 'object' && obj !== null) {
        const sanitized: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };
    
    req.body = sanitizeObject(req.body);
  }
  
  next();
}

// Cleanup function for rate limit store
function cleanupRateLimitStore() {
  const now = Date.now();
  
  // Clean up rate limit entries
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
  
  // Clean up failed login attempts
  Array.from(failedLoginAttempts.entries()).forEach(([key, value]) => {
    if (value.blockedUntil < now && value.blockedUntil > 0) {
      failedLoginAttempts.delete(key);
    }
  });
}

export function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
  // Skip API key validation for public endpoints
  if (req.path.startsWith('/api/enrollment') || req.path.startsWith('/api/pdf/')) {
    return next();
  }
  
  // For admin endpoints, check session instead of API key
  if (req.path.startsWith('/api/admin/')) {
    return next();
  }
  
  next();
}