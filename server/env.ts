import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  PORT: z.string().optional(),
  MAX_REQUESTS_PER_WINDOW: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  SESSION_MAX_AGE: z.string().optional(),
  PRODUCTION_DOMAIN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

export function validateEnv() {
  try {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error('❌ Environment validation failed:');
      result.error.errors.forEach(error => {
        console.error(`  - ${error.path.join('.')}: ${error.message}`);
      });
      return false;
    }
    
    // Additional production checks
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.PRODUCTION_DOMAIN) {
        console.warn('⚠️  Warning: PRODUCTION_DOMAIN not set for production environment');
      }
      
      if (process.env.SESSION_SECRET === 'innovision-school-super-secure-secret-key-for-production-2024-$#@!') {
        console.error('❌ Please change SESSION_SECRET from default value in production!');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    return false;
  }
}