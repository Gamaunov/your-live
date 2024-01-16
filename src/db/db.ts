import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbName = 'test';

const mongoURI: string =
  process.env.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`;

if (!mongoURI) throw new Error('mongoURI not found');

export async function runDB(): Promise<void> {
  try {
    await mongoose.connect(mongoURI);
    console.log('mongoDb successfully connected');
  } catch {
    console.error('connection error');
    await mongoose.disconnect();
  }
}
