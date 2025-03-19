import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { json } from 'body-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from 'dotenv';
import authRoutes from './routes/auth.routes';
import logger from './utils/logger';

config();

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(json());
app.use(mongoSanitize());

// New logging middleware: logs each incoming request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api', authRoutes); // add other routers as needed

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server only if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  prisma.$connect().then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  });
}

export default app;
