import express, { type Request, Response, NextFunction } from "express";
import session, { type SessionOptions } from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import { hashPassword } from "./auth";
import { nanoid } from "nanoid";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In production behind a proxy (Render/Railway), enable trust proxy so secure cookies work
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

// Session configuration
const PgSessionStore = connectPgSimple(session);
const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET || "fitplan-dev-secret-key-2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: app.get("env") === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

// Use Postgres-backed session store when a DATABASE_URL is configured
if (process.env.DATABASE_URL) {
  sessionOptions.store = new PgSessionStore({
    pool,
    createTableIfMissing: true,
  });
}

app.use(session(sessionOptions));

// Auto-guest middleware: automatically create/assign a guest session for API routes
app.use(async (req, _res, next) => {
  try {
    if (!req.session.userId && req.path.startsWith("/api")) {
      const guestIdSuffix = nanoid(8);
      const guestUsername = `guest_${guestIdSuffix}`;
      const guestEmail = `${guestUsername}@guest.local`;
      const guestPasswordHash = await hashPassword("guest123");
      const guestUser = await storage.createUser({
        username: guestUsername,
        email: guestEmail,
        password: guestPasswordHash,
        fullName: "Guest User",
      });
      req.session.userId = guestUser.id;
    }
  } catch (_err) {
    // If guest creation fails, continue without blocking the request
  }
  next();
});

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
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Server error:", err);
      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Railway will provide the PORT environment variable
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
    port,
    host: "0.0.0.0", // Railway needs 0.0.0.0 to accept external connections
  }, () => {
    log(`🚀 FitPlan server running on port ${port}`);
    log(`📍 Health check: http://localhost:${port}/health`);
  });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }

})();
