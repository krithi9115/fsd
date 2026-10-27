import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import app from './server/app.ts';
import { connectDB } from './server/config/db.ts';
import { seedDatabase } from './server/seed.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    // 1. Establish MongoDB connection (real Mongo / MongoMemoryServer)
    await connectDB();

    // 2. Seed initial demo and benchmark dataset if clean
    await seedDatabase();

    // 3. Vite development middleware or static production serving
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware successfully integrated with Express.');
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log(`Serving static production assets from ${distPath}`);
    }

    // 4. Listen on PORT 3000
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 MERN Platform running at http://0.0.0.0:${PORT}`);
      console.log(`📊 Mode: ${isProduction ? 'Production' : 'Development'}`);
      console.log(`=======================================================`);
    });
  } catch (err: any) {
    console.error('Fatal startup error in server.ts:', err);
    process.exit(1);
  }
}

startServer();
