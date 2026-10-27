import mongoose from 'mongoose';

let mongoMemoryServer: any = null;

export async function connectDB(): Promise<void> {
  // If already connected (e.g. reused serverless lambda instance), return immediately
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const customUri = process.env.MONGO_URI;
  const isVercel = Boolean(process.env.VERCEL);

  // 1. In a Vercel serverless environment, an external MongoDB (such as MongoDB Atlas) is required
  if (isVercel) {
    if (!customUri || customUri.includes('localhost')) {
      throw new Error(
        'MongoDB URI missing: In Vercel serverless deployment, you must set the MONGO_URI environment variable to your MongoDB Atlas connection string (mongodb+srv://...).'
      );
    }

    try {
      console.log('Connecting to cloud MongoDB Atlas instance...');
      await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log('MongoDB successfully connected in serverless environment.');
      return;
    } catch (err: any) {
      console.error('Fatal: Failed to connect to MongoDB Atlas in serverless environment:', err.message);
      throw err;
    }
  }

  // 2. In non-Vercel environment: attempt external MongoDB URI if specified
  if (customUri && !customUri.includes('localhost:27017')) {
    try {
      console.log(`Connecting to specified MongoDB URI: ${customUri.replace(/\/\/.*@/, '//***@')}`);
      await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB successfully connected via external URI.');
      return;
    } catch (err: any) {
      console.warn(`External MongoDB connection failed (${err.message}). Falling back to embedded MongoMemoryServer.`);
    }
  }

  // 3. Connect to local or embedded in-memory MongoDB
  try {
    if (customUri && customUri.includes('localhost:27017')) {
      // Check if standard local Mongo is running
      try {
        await mongoose.connect(customUri, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB connected to local mongod instance on 27017.');
        return;
      } catch {
        // Fallback to MongoMemoryServer
      }
    }

    console.log('Spinning up dedicated high-performance MongoMemoryServer instance for MERN stack...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully via MongoMemoryServer instance at ${uri}`);
  } catch (error: any) {
    console.error('Fatal: Failed to establish MongoDB connection:', error.message);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
