/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db/connectDB';

import { Simulation, Message } from '../../../../lib/db/models';

import gemini from '../../../../lib/db/gemini';

const model = gemini()

// analyzes the conversation of a given simulation and finds out the estimated average likelihood for demographic groups
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const simulationId = searchParams.get("simulationId");

    if (!simulationId) {
      return NextResponse.json({ status: 400, message: "Must provide simulation id in the params." });
    }

    const simulation = await Simulation.findById(simulationId);

    if (!simulation) {
      return NextResponse.json({ status: 400, message: "No such simulation found!" });
    }

    const conversation = await Message.find({ simulationId }).sort({ turn: 1 });

    if (!conversation || conversation?.length === 0) {
      return NextResponse.json({ status: 400, message: "The simulation has no conversation yet." });
    }

    const groupLikelihoods: { [key: string]: { totalLikelihood: number; count: number; averageLikelihood: number } } = {};

    for (const message of conversation) {
      if (message.purchaseLikelihood !== null) {
        const senderDetails = message.senderDetails;
        let groupKey = '';

        // Create a key based on the demographic traits of the sender
        if (senderDetails.ageRange) groupKey += `Age:${senderDetails.ageRange.map((r :any) => `${r.min}-${r.max}`).join(',')}|`;
        if (senderDetails.gender) groupKey += `Gender:${senderDetails.gender.join(',')}|`;
        if (senderDetails.incomeRange) groupKey += `Income:${senderDetails.incomeRange.map((r :any) => `${r.min}-${r.max}`).join(',')}|`;
        if (senderDetails.occupation) groupKey += `Occupation:${senderDetails.occupation.join(',')}|`;

        if (groupKey) {
          if (!groupLikelihoods[groupKey]) {
            groupLikelihoods[groupKey] = { totalLikelihood: 0, count: 0, averageLikelihood: 0 };
          }
          groupLikelihoods[groupKey].totalLikelihood += message.purchaseLikelihood;
          groupLikelihoods[groupKey].count++;
        }
      }
    }

    // Calculate average likelihood for each group
    for (const key in groupLikelihoods) {
      groupLikelihoods[key].averageLikelihood = groupLikelihoods[key].count > 0 ?
        groupLikelihoods[key].totalLikelihood / groupLikelihoods[key].count :
        0;
    }

    const analyticsResult = { groupLikelihoods, geminiRemark: "" };

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
      analyticsResult.geminiRemark = cleanGeminiText(geminiText)
    } catch (error: any) {
      console.error("Error getting Gemini remark:", error);
      analyticsResult.geminiRemark = "Error generating remark.";
    }

    return NextResponse.json({ status: 200, analyticsResult });
  } catch (error) {
    console.log('Error: ', error);
    return NextResponse.json({ status: 500, message: "Some error occurred." });
  }
}

const cleanGeminiText = (geminiText : string) => {
    return geminiText
      // Preserve code block formatting
      .replace(/```([\s\S]*?)```/g, (match) => match.replace(/\n/g, '\\n'))
      
      // Convert **text** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Convert list items, ensuring proper <ul> wrapping
      // List item parsing without 's' (dotall) flag
      .replace(/\n\* (.*?)(?=\n\*|\n\n|$)/g, (match) => {
        // Split multiple list items within the same block
        const items = match.split('\n* ').filter(function(item) {
          return item.trim() !== '';
        });
        
        return `<ul>${items.map(function(item) {
          return `<li>${item.trim()}</li>`;
        }).join('')}</ul>`;
      })
      
      // Handle line breaks
      .replace(/\\n/g, '<br/>')
      .replace(/\n/g, '<br/>')
      
      // Clean up unnecessary breaks and improve list formatting
      .replace(/<\/li><br\/>/g, '</li>')
      .replace(/<br\/><br\/>+/g, '<br/>')
      
      // Ensure headings and strong tags are preserved
      .replace(/<\/strong><br\/>/g, '</strong>')
      
      // Remove consecutive <ul> tags
      .replace(/<\/ul>\s*<ul>/g, '')
      
      // Final cleanup of empty or unnecessary tags
      .replace(/<ul><\/ul>/g, '')
      .replace(/<li><\/li>/g, '')
      .trim();
  };