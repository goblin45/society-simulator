import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db/connectDB';
import { Simulation } from '../../../lib/db/models';

export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const searchParams = req.nextUrl.searchParams;
        const id = searchParams.get("id")

        let simulations = []
        if (!id) {
            simulations = await Simulation.find({ })
        } else {
            simulations = await Simulation.find({ _id: id })
        }

        if (simulations?.length === 0) {
            return NextResponse.json({ status: 400, message: "No simulation found!" })
        }

        return NextResponse.json({ status: 200, simulations }) 
    } catch (error) {
        console.log("Error: ", error)
        return NextResponse.json({ status: 500, message: "Some error occurred!" })
    }
}