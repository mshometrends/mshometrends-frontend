import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

export const healthRouter = Router();

// Full Health Metric check (DB status, Memory, Uptime)
healthRouter.get('/health', healthController.getHealth);

// Ultra-fast Ping endpoint for UptimeRobot / cron-job.org / BetterStack
healthRouter.get('/ping', healthController.getPing);

// Keep-Alive endpoint
healthRouter.get('/keepalive', healthController.getKeepalive);
