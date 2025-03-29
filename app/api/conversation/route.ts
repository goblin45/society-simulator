import { NextResponse, NextRequest } from 'next/server';
import { Message, Simulation } from '../../../lib/db/models';
import connectDB from '../../../lib/db/connectDB';

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const searchParams = req.nextUrl.searchParams;
        const simulationId = searchParams.get('simulationId');

        if (!simulationId) {
            return NextResponse.json({ error: 'Must provide Simulation Id.'}, { status: 400 })
        }

        const simulation = await Simulation.find({ _id: simulationId })
        if (!simulation) {
            return NextResponse.json({error: "No such simulation exists."}, { status: 400 })
        }

        const conversation = await Message.find({ simulationId: simulationId })

        if (!conversation || conversation?.length === 0) {
            return NextResponse.json({ error: "No conversation found for this simulation." }, { status: 400})
        }

        return NextResponse.json({ status: 200, conversation: conversation })
    } catch (error) {
        console.log("Error: ", error)
        return NextResponse.json({ error: "Failed to process the request."}, {status: 500})
    }
}