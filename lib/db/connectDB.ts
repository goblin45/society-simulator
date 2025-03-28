import mongoose from 'mongoose';

const mongoUri = process.env.DB_URI;
let isConnected = false

export default async function connectDB() {
    if (!mongoUri) {
      throw new Error('MongoDB URI is missing.');
    }
    if (isConnected) return;
    try {
      await mongoose.connect(mongoUri);
      isConnected = true
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
}