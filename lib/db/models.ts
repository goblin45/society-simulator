import mongoose from 'mongoose'

import { SocietySimulationRequest } from '../types/request';

interface SimulationDocument extends SocietySimulationRequest, mongoose.Document {
    createdAt: Date;
  }
  
  interface MessageDocument extends mongoose.Document {
    simulationId: mongoose.Schema.Types.ObjectId;
    turn: number; // Changed from order
    sender: string;
    senderDetails: { [key: string]: any };
    content: string;
    purchaseLikelihood: number | null; // Added for purchase likelihood
    createdAt: Date;
  }
  
  const SimulationSchema = new mongoose.Schema<SimulationDocument>({
    productName: String,
    productDescription: String,
    productCost: Number,
    exposureMessage: String,
    numberOfTurns: Number, // Updated schema
    demographics: [Object],
    createdAt: { type: Date, default: Date.now },
  });
  
  const MessageSchema = new mongoose.Schema<MessageDocument>({
    simulationId: mongoose.Schema.Types.ObjectId,
    turn: Number,
    sender: String,
    senderDetails: { type: Object, default: {} },
    content: String,
    purchaseLikelihood: { type: Number, default: null }, // Added field
    createdAt: { type: Date, default: Date.now },
  });
  
export const Simulation = mongoose.models.Simulation || mongoose.model<SimulationDocument>('Simulation', SimulationSchema);
export const Message = mongoose.models.Message || mongoose.model<MessageDocument>('Message', MessageSchema);