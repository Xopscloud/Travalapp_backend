import mongoose from 'mongoose';
import { env } from './env';

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(env.mongoUri);
}
