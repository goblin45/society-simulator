"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ChatPane from "../chat-pane";
import AnalyzeResult from "../analyze-result";
import Loader from "../../../components/Loader";

export default function ConversationPage() {
    const { id: simulationId } = useParams(); 
    const [simulationData, setSimulationData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!simulationId) return;

        // Fetch simulation data based on simulationId
        async function fetchSimulation() {
            try {
                const response = await fetch(`/api/simulation?id=${simulationId}`);
                // if (!response.ok) throw new Error("Failed to fetch simulation data");

                const data = await response.json();
                setSimulationData(data);
            } catch (error) {
                console.error("Error fetching simulation data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSimulation();
    }, [simulationId]);

    if (!simulationId) return <p className="text-center">No simulation ID provided.</p>;
    if (loading) return (<Loader/>);

    return (
        <div className="flex flex-col gap-4 p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">Simulation Conversation</h1>
            <ChatPane simulationId={simulationId} simulationData={simulationData} />
            <AnalyzeResult simulationId={simulationId} simulationData={simulationData} />
        </div>
    );
}
