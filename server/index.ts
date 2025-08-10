import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool, databaseKind, initializeDatabase } from './db';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In production behind a proxy (e.g., Render), trust proxy so secure cookies work
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
}

// Session configuration
let sessionStore: session.Store | undefined;
if (databaseKind === 'postgres' && pool) {
  const connectPgSimple = (await import('connect-pg-simple')).default;
  const PgSession = connectPgSimple(session);
  sessionStore = new PgSession({ pool, createTableIfMissing: true });
}

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'fitplan-dev-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: app.get('env') === 'production',
    httpOnly: true,
    sameSite: app.get('env') === 'production' ? 'lax' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Add a simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitPlan server is running!' });
});

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
  try {
    await initializeDatabase();
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Server error:", err);
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`🚀 FitPlan server running on port ${port}`);
    log(`📍 Health check: http://localhost:${port}/health`);
  });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }

})();
