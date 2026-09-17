import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './src/backend/config/db.js';
import { apiRouter } from './src/backend/routes/index.js';
import { uploadRouter } from './src/backend/routes/upload.routes.js';
import { seoRouter } from './src/backend/routes/seo.routes.js';
import { healthRouter } from './src/backend/routes/health.routes.js';
import { errorHandler } from './src/backend/middleware/index.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB Connection
  await connectDB();

  // Enable CORS for cross-origin requests (Supporting frontend-backend separation & preflight checks)
  const corsOptions = {
    origin: true, // Reflect request origin or allow all
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-admin-key',
      'x-admin-token',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-CSRF-Token',
      'Accept-Version',
      'Content-Length',
      'Content-MD5',
      'Date',
      'X-Api-Version',
    ],
    exposedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Strip duplicate /api/v1/api/v1/ in incoming request URLs
  app.use((req, _res, next) => {
    if (req.url.includes('/api/v1/api/v1/')) {
      req.url = req.url.replace(/\/api\/v1\/api\/v1\//g, '/api/v1/');
    }
    next();
  });

  // SEO, AEO & GEO discovery endpoints (sitemap.xml, robots.txt, llms.txt)
  app.use('/', seoRouter);

  // Dedicated Health, Ping & Keep-Alive Monitoring Routes
  app.use('/', healthRouter);
  app.use('/api', healthRouter);
  app.use('/api/v1', healthRouter);

  // REST API Routes (with multi-prefix and duplicate protection)
  app.use('/api/v1/api/v1', apiRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/v1/upload', uploadRouter);
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  // Background Keep-Alive / Health Heartbeat (Prevents Cold Starts & Server Sleep)
  const KEEP_ALIVE_INTERVAL_MS = 5 * 60 * 1000; // Every 5 minutes
  setInterval(async () => {
    try {
      // Keep DB connection warm
      if (process.env.MONGODB_URI) {
        await connectDB();
      }
      console.log(`[Keep-Alive Heartbeat] Server active at ${new Date().toISOString()} | Uptime: ${Math.floor(process.uptime())}s`);
    } catch (err) {
      console.warn('[Keep-Alive Heartbeat] Ping warning:', err);
    }
  }, KEEP_ALIVE_INTERVAL_MS);

  // Serve Frontend via Vite in Dev, or Static Assets in Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MS Home Trends] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
