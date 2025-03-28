"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyzeResult({ simulationId }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/api/conversation/analyze?simulationId=${simulationId}`)
            .then((res) => res.json())
            .then(setData);
    }, [simulationId]);

    if (!data) return <p>Loading analysis...</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Analysis Result</h2>
            <div className="flex gap-4">
                {/* Recharts Bar Chart */}
                <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.analyticsResult.groupLikelyhoods}>
                            <XAxis dataKey="group" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="likelihood" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            
                <div className="w-1/2 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold">Gemini’s Remark</h3>
                    <p className="text-sm text-gray-700">{data.analyticsResult.geminiRemark}</p>
                </div>
            </div>
        </div>
    );
}
