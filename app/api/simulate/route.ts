// app/api/simulate/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

// Replace with your actual Gemini API key and MongoDB URI
const geminiApiKey = process.env.GEMINI_API_KEY;
const mongoUri = process.env.DB_URI;

interface SocietySimulationRequest {
  productName: string;
  productDescription: string;
  productCost: number;
  exposureMessage: string;
  numberOfTurns: number; // Changed from conversationLength
  demographics: {
    occupation?: string[];
    ageRange?: { min: number; max: number }[];
    gender?: string[];
    incomeRange?: { min: number; max: number }[];
    count: number;
  }[];
}

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

const Simulation = mongoose.models.Simulation || mongoose.model<SimulationDocument>('Simulation', SimulationSchema);
const Message = mongoose.models.Message || mongoose.model<MessageDocument>('Message', MessageSchema);

async function connectMongo() {
  if (!mongoUri) {
    throw new Error('MongoDB URI is missing.');
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Helper function to generate initial agents
function generateAgents(demographics: SocietySimulationRequest['demographics']): { name: string; details: { [key: string]: any } }[] {
  const agents: { name: string; details: { [key: string]: any } }[] = [];
  let agentCount = 1;
  demographics.forEach(demo => {
    for (let i = 0; i < demo.count; i++) {
      const details: { [key: string]: any } = {};
      if (demo.occupation) details.occupation = demo.occupation;
      if (demo.ageRange) details.ageRange = demo.ageRange;
      if (demo.gender) details.gender = demo.gender;
      if (demo.incomeRange) details.incomeRange = demo.incomeRange;

      agents.push({
        name: `Agent ${agentCount}`,
        details: details,
      });
      agentCount++;
    }
  });
  return agents;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const requestBody = await req.json() as SocietySimulationRequest;

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const simulation = new Simulation(requestBody);
    await simulation.save();
    const simulationId = simulation._id;

    const agents = generateAgents(requestBody.demographics);
    const conversationHistory: { sender: string; content: string }[] = [];

    for (let turn = 1; turn <= agents.length * requestBody.numberOfTurns; turn++) {
      const currentAgentIndex = (turn - 1) % agents.length;
      const currentAgent = agents[currentAgentIndex];

      let context = `You are simulating a society reacting to a new product: ${requestBody.productName} (${requestBody.productDescription}, cost: $${requestBody.productCost}). The initial message was: "${requestBody.exposureMessage}". Here's the current conversation:\n${conversationHistory.length > 0 ? conversationHistory.map(msg => `${msg.sender}: ${msg.content}`).join('\n') : 'No conversation yet'}\n`;
      context += `The next person to speak is ${currentAgent.name}. This persona's traits are: ${Object.entries(currentAgent.details)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('. ')}.`;
      context += ` Think according to this persona's interests and either contribute something new to the chat or agree or argue with previous messages. Do not repeat any message. Entire response must put value to the conversation and be human-like, not a single phrase should be said that suggests the response is generated by an AI. Respond in no more than 40 words, and also estimate the likelihood (in percentage) of this persona buying the product based on their message, enclosed within asterisks (e.g., *50%*); don't include "** **", "\n" or any unnecessary characters anywhere in your response.`;

      const prompt = `${context}\n\n${currentAgent.name} is about to speak.`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const likelihoodMatch = text.match(/\*(\d+)%\*/);
        const purchaseLikelihood = likelihoodMatch ? parseInt(likelihoodMatch[1], 10) : null;
        const messageContent = text

        const newMessage = { sender: currentAgent.name, content: messageContent };
        conversationHistory.push(newMessage);

        console.log(`${currentAgent.name}: ${messageContent} (Likelihood: ${purchaseLikelihood}%)`);

        const message = new Message({
          simulationId: simulationId,
          turn: turn,
          sender: currentAgent.name,
          senderDetails: currentAgent.details,
          content: messageContent,
          purchaseLikelihood: purchaseLikelihood,
        });
        await message.save();

      } catch (error: any) {
        console.error("Error generating message:", error);
        return NextResponse.json({ error: 'Error generating message' }, { status: 500 });
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ status: 'completed', conversation: conversationHistory });

  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}