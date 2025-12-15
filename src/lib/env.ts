import { z } from "zod";

// Environment variable schema for type safety and validation
const envSchema = z.object({
  // Convex & Database
  CONVEX_DEPLOYMENT: z.string().min(1),
  CONVEX_SITE_URL: z.string().url(),

  // Authentication & Security
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "Refresh token secret must be at least 32 characters"),
  SESSION_EXPIRY_DAYS: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(365)),
  REFRESH_TOKEN_EXPIRY_DAYS: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(365)),

  // External APIs
  GOVERNMENT_API_BASE_URL: z.string().url().optional(),
  GOVERNMENT_API_KEY: z.string().min(1).optional(),

  // Email Service
  EMAIL_SERVICE_PROVIDER: z.enum(["sendgrid", "ses", "mailgun"]).optional(),
  EMAIL_SERVICE_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM_ADDRESS: z.string().email().optional(),

  // Analytics
  ANALYTICS_PROVIDER: z.enum(["google", "mixpanel", "amplitude"]).optional(),
  ANALYTICS_API_KEY: z.string().min(1).optional(),

  // Storage
  STORAGE_PROVIDER: z.enum(["aws", "gcp", "azure"]).optional(),
  STORAGE_BUCKET_NAME: z.string().min(1).optional(),
  STORAGE_ACCESS_KEY: z.string().min(1).optional(),
  STORAGE_SECRET_KEY: z.string().min(1).optional(),

  // Frontend Config
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email(),
  NEXT_PUBLIC_GOVERNMENT_WEBSITE: z.string().url(),

  // Development
  NODE_ENV: z.enum(["development", "production", "test"]),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]),
  ENABLE_DEBUG_LOGGING: z.string().transform(Boolean),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().min(1000)),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().min(1)),
  RATE_LIMIT_AUTH_MAX_REQUESTS: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1)),
});

// Validate and export environment variables
export const env = envSchema.parse(process.env);

// Export individual variables for convenience
export const {
  CONVEX_DEPLOYMENT,
  CONVEX_SITE_URL,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  SESSION_EXPIRY_DAYS,
  REFRESH_TOKEN_EXPIRY_DAYS,
  GOVERNMENT_API_BASE_URL,
  GOVERNMENT_API_KEY,
  EMAIL_SERVICE_PROVIDER,
  EMAIL_SERVICE_API_KEY,
  EMAIL_FROM_ADDRESS,
  ANALYTICS_PROVIDER,
  ANALYTICS_API_KEY,
  STORAGE_PROVIDER,
  STORAGE_BUCKET_NAME,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET_KEY,
  NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_SUPPORT_EMAIL,
  NEXT_PUBLIC_GOVERNMENT_WEBSITE,
  NODE_ENV,
  LOG_LEVEL,
  ENABLE_DEBUG_LOGGING,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_AUTH_MAX_REQUESTS,
} = env;
