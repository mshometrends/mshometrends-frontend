import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Format uptime seconds into human-readable format
 */
const formatUptime = (seconds: number): string => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};

/**
 * Controller: Health & Keep-Alive Monitoring
 */
export const healthController = {
  /**
   * Comprehensive Health Check endpoint
   * GET /api/health or /api/v1/health
   */
  getHealth: async (req: Request, res: Response) => {
    const startTime = Date.now();
    const uptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();

    // Check MongoDB Connection State
    let dbStatus = 'disconnected';
    let dbLatencyMs: number | null = null;

    try {
      const state = mongoose.connection.readyState;
      if (state === 1) {
        const pingStart = Date.now();
        if (mongoose.connection.db) {
          await mongoose.connection.db.admin().ping();
          dbLatencyMs = Date.now() - pingStart;
        }
        dbStatus = 'connected';
      } else if (state === 2) {
        dbStatus = 'connecting';
      } else {
        dbStatus = 'disconnected';
      }
    } catch (err: any) {
      dbStatus = 'error';
    }

    const responsePayload = {
      status: 'healthy',
      service: 'MS Home Trends E-Commerce Server',
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        formatted: formatUptime(uptimeSeconds),
      },
      database: {
        status: dbStatus,
        host: mongoose.connection.host || 'MongoDB Atlas',
        name: mongoose.connection.name || 'mshometrends',
        latencyMs: dbLatencyMs,
      },
      system: {
        memory: {
          rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
          heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
          heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        },
        nodeVersion: process.version,
      },
      responseTimeMs: Date.now() - startTime,
    };

    return res.status(200).json(responsePayload);
  },

  /**
   * Ultra-lightweight Ping endpoint for UptimeRobot / Cron KeepAlive
   * GET /api/ping or /ping
   */
  getPing: (req: Request, res: Response) => {
    return res.status(200).send('PONG');
  },

  /**
   * Detailed Keepalive heartbeat
   * GET /api/keepalive
   */
  getKeepalive: (req: Request, res: Response) => {
    return res.status(200).json({
      status: 'alive',
      message: 'MS Home Trends server is running 24/7',
      time: new Date().toISOString(),
    });
  },
};
