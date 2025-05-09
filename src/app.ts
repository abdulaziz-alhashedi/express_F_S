/**
 * Main Application Entry Point
 *
 * This module sets up the Express server including:
 * - Security middlewares (Helmet, CORS, rate limiting, input sanitization)
 * - Logging of incoming requests (with trace IDs)
 * - Route registrations (auth, user, external, docs)
 * - Error handling and graceful shutdown logic.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { prisma } from '@/utils/prisma';
import { json } from 'body-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from '@/routes/auth.routes';
import logger from '@/utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { v4 as uuidv4 } from 'uuid';
import externalRoutes from '@/routes/external.routes';  
import userRoutes from '@/routes/user.routes';
import { errorHandler } from './middlewares/errorHandler';

import { config as appConfig } from '@/config/config';
import { ExpressFramework } from './framework/ExpressFramework';

const framework = new ExpressFramework(appConfig.PORT);

framework.app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'"]
      }
    }
  })
);
framework.app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
framework.app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
framework.app.use(helmet.noSniff());
framework.app.use(
  cors({
    origin: appConfig.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
  })
);
framework.app.use(json());
framework.app.use(mongoSanitize());

framework.app.use((req, res, next) => {
  const traceId = uuidv4();
  req.headers['x-trace-id'] = traceId;
  res.setHeader('X-Trace-Id', traceId);
  next();
});

framework.app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - TraceID: ${req.headers['x-trace-id']}`);
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
framework.app.use(limiter);

framework.registerModule('/api/v1/auth', authRoutes);
const swaggerRouter = express.Router();
swaggerRouter.use(swaggerUi.serve, swaggerUi.setup(swaggerDocument));
framework.registerModule('/api/v1/docs', swaggerRouter);
framework.registerModule('/api/v1/external', externalRoutes);
framework.registerModule('/api/v1/users', userRoutes);

framework.app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

framework.app.use(errorHandler);

if (require.main === module) {
  prisma.$connect().then(() => {
    const server = framework.start();
    const shutdown = () => {
      server.close(() => {
        prisma.$disconnect().then(() => process.exit(0));
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  });
}

export default framework.app;