/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/connectDB';
import { Simulation, Message } from '../../../../lib/db/models';
import gemini from '../../../../lib/db/gemini';

const model = gemini();

// Analyzes the conversation and estimates the likelihood for demographic groups
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const simulationId = searchParams.get("simulationId");

    if (!simulationId) {
      return NextResponse.json({ error: "Must provide simulation id in the params." }, { status: 400 });
    }

    const simulation = await Simulation.findById(simulationId);
    if (!simulation) {
      return NextResponse.json({ error: "No such simulation found!" }, { status: 400 });
    }

    const conversation = await Message.find({ simulationId }).sort({ turn: 1 });
    if (!conversation || conversation.length === 0) {
      return NextResponse.json({ error: "The simulation has no conversation yet." }, { status: 400 });
    }

    const groupLikelihoods: { [key: string]: { totalLikelihood: number; count: number; averageLikelihood: number; senderDetails:any[]; } } = {};
    const senderDetailsList: any[] = [];

    for (const message of conversation) {
      if (message.purchaseLikelihood !== null) {
        const senderDetails = message.senderDetails;
        let groupKey = '';

        // Construct demographic key
        if (senderDetails.ageRange) groupKey += `Age:${senderDetails.ageRange.map((r: any) => `${r.min}-${r.max}`).join(',')}|`;
        if (senderDetails.gender) groupKey += `Gender:${senderDetails.gender.join(',')}|`;
        if (senderDetails.incomeRange) groupKey += `Income:${senderDetails.incomeRange.map((r: any) => `${r.min}-${r.max}`).join(',')}|`;
        if (senderDetails.occupation) groupKey += `Occupation:${senderDetails.occupation.join(',')}|`;

        
        senderDetailsList.push({
          messageId: message._id,
          senderDetails,
          purchaseLikelihood: message.purchaseLikelihood,
        });

        // Calculate likelihood
        if (groupKey) {
          if (!groupLikelihoods[groupKey]) {
            groupLikelihoods[groupKey] = { 
              totalLikelihood: 0, 
              count: 0, 
              averageLikelihood: 0, 
              senderDetails: [] 
            };
          }
          groupLikelihoods[groupKey].totalLikelihood += message.purchaseLikelihood;
          groupLikelihoods[groupKey].count++;
          groupLikelihoods[groupKey].senderDetails.push(senderDetails);
        }
      }
    }

    // Compute average likelihood for each group
    for (const key in groupLikelihoods) {
      groupLikelihoods[key].averageLikelihood =
        groupLikelihoods[key].count > 0 ? groupLikelihoods[key].totalLikelihood / groupLikelihoods[key].count : 0;
    }

    const analyticsResult = {
      groupLikelihoods, // Now included in the response
      geminiRemark: "",
    };

    const prompt = `
        Analyze the following simulated conversation data for the product:
        - Product Name: ${simulation.productName}
        - Price: ${simulation.productCost}
        - Description: ${simulation.productDescription}

        Key Objectives:
        1. Highlight key takeaways about customer interest and behavior.
        2. Identify potential target markets based on the data.
        3. Provide suggestions for improving the product or marketing strategy.
        4. Use fine formatting like bold, bullets etc.

        Respond concisely, limited to 100 words or less.

        Data: 
        ${JSON.stringify(analyticsResult, null, 2)}
    `;

    try {
      const geminiResponse = await model.generateContent(prompt);
      const geminiText = geminiResponse.response.text();
      analyticsResult.geminiRemark = cleanGeminiText(geminiText);
    } catch (error: any) {
      console.error("Error getting Gemini remark:", error);
      analyticsResult.geminiRemark = "Error generating remark.";
    }

    return NextResponse.json({ status: 200, analyticsResult });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ error: "Some error occurred." }, { status: 500 });
  }
}

// Function to clean and format Gemini text
const cleanGeminiText = (geminiText: string) => {
  return geminiText
    .replace(/```([\s\S]*?)```/g, (match) => match.replace(/\n/g, '\\n'))
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\* (.*?)(?=\n\*|\n\n|$)/g, (match) => {
      const items = match.split('\n* ').filter(item => item.trim() !== '');
      return `<ul>${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    })
    .replace(/\\n/g, '<br/>')
    .replace(/\n/g, '<br/>')
    .replace(/<\/li><br\/>/g, '</li>')
    .replace(/<br\/><br\/>+/g, '<br/>')
    .replace(/<\/strong><br\/>/g, '</strong>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/<ul><\/ul>/g, '')
    .replace(/<li><\/li>/g, '')
    .trim();
};
