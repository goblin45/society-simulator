"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ChatPane from "../chat-pane";
import AnalyzeResult from "../analyze-result";

export default function ConversationPage() {
    const { id: simulationId } = useParams(); // ✅ Extract simulationId from URL
    const [simulationData, setSimulationData] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (!simulationId) return;

    //     // Fetch simulation data based on simulationId
    //     async function fetchSimulation() {
    //         try {
    //             const response = await fetch(`/api/simulation/${simulationId}`);
    //             if (!response.ok) throw new Error("Failed to fetch simulation data");

    //             const data = await response.json();
    //             setSimulationData(data);
    //         } catch (error) {
    //             console.error("Error fetching simulation data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     fetchSimulation();
    // }, [simulationId]);

    // if (!simulationId) return <p className="text-center">No simulation ID provided.</p>;
    // if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="flex flex-col gap-4 p-6">
            <h1 className="text-2xl font-bold">Simulation Conversation: {simulationId}</h1>
            {/* <ChatPane simulationId={simulationId} simulationData={simulationData} />
            <AnalyzeResult simulationId={simulationId} simulationData={simulationData} /> */}
        </div>
    );
}
