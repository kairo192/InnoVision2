import 'dotenv/config';
import crypto from 'crypto';
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { env, validateEnv } from "./env";
import { securityHeaders, rateLimiter, validateInput } from "./middleware/security";

// Validate environment variables
if (!validateEnv()) {
  process.exit(1);
}

const app = express();

// Enable trust proxy for production environments
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(securityHeaders);
app.use(validateInput);

// Dynamic rate limiting based on environment
const maxRequests = parseInt(env.MAX_REQUESTS_PER_WINDOW || '100', 10);
const windowMs = parseInt(env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
app.use(rateLimiter(maxRequests, windowMs));

// Body parsing with size limits
app.use(express.json({ 
  limit: env.NODE_ENV === 'production' ? '5mb' : '10mb',
  type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: env.NODE_ENV === 'production' ? '5mb' : '10mb'
}));

// Enhanced session configuration
const sessionMaxAge = parseInt(env.SESSION_MAX_AGE || '86400000', 10); // 24 hours default
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'innovision.sid', // Custom session name
  cookie: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: sessionMaxAge,
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax'
  },
  rolling: true, // Reset expiration on activity
  genid: () => {
    // Generate cryptographically secure session IDs
    return crypto.randomBytes(16).toString('hex');
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(env.PORT || '5000', 10);
  const host = env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  server.listen(port, host, () => {
    log(`🚀 Server running on ${host}:${port}`);
    log(`📖 Environment: ${env.NODE_ENV}`);
    if (env.NODE_ENV === 'production') {
      log('🔒 Production security measures active');
    }
  });
})();
