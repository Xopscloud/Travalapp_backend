import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(env.mongoUri);
}
