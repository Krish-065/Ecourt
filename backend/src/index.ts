import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index';
import apiRoutes from './routes/api';
import { apiRateLimiter } from './middleware/rateLimiter';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*', // Configure origin in production
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(apiRateLimiter);

// Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ECourt Core API Gateway',
    timestamp: new Date().toISOString(),
  });
});

// API v1 Router
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Exception:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

app.listen(config.port, () => {
  console.log(`🚀 ECourt Backend Service running on port ${config.port} [${config.nodeEnv}]`);
});
