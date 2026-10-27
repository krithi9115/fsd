import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import analysisRoutes from './routes/analysisRoutes.ts';
import dashboardRoutes from './routes/dashboardRoutes.ts';
import feedbackRoutes from './routes/feedbackRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import adminRoutes from './routes/adminRoutes.ts';
import { errorHandler } from './middleware/errorMiddleware.ts';

dotenv.config();

const app = express();

// Security & Parsing Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Misinformation Verification Platform API',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'local-express',
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;
