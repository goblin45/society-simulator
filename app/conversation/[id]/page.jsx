"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChatPane from "../chat-pane";
import AnalyzeResult from "../analyze-result";
import Loader from "../../../components/Loader";
import { Button } from "../../../@/components/ui/button";

export default function ConversationPage() {
    const { id: simulationId } = useParams(); 
    const router = useRouter()
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
            <div className="flex flex-row w-full justify-between">
            <h1 className="text-2xl font-bold">Simulation Conversation</h1>
            <Button onClick={() => router.push("/simulation")} className="">
                Back
            </Button>
            </div>
            
            <ChatPane simulationId={simulationId} simulationData={simulationData} />
            <AnalyzeResult simulationId={simulationId} simulationData={simulationData} />
        </div>
    );
}
