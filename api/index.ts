import type { Request, Response } from 'express';
import app from '../server/app.ts';
import { connectDB } from '../server/config/db.ts';
import { seedDatabase } from '../server/seed.ts';

let isInitialized = false;

async function initialize() {
  if (!isInitialized) {
    await connectDB();
    try {
      await seedDatabase();
    } catch (seedErr: any) {
      console.warn('Initial seeding note:', seedErr?.message || seedErr);
    }
    isInitialized = true;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    await initialize();
  } catch (error: any) {
    console.error('Database connection error in Vercel serverless function:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGO_URI environment variable is configured in Vercel.',
      error: error.message,
    });
  }

  return app(req, res);
}
