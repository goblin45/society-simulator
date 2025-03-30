"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function parseGeminiRemark(htmlString) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const keyTakeaways = Array.from(tempDiv.querySelectorAll("ul:nth-of-type(1) li")).map(li => li.innerText);
    const potentialTargetMarkets = Array.from(tempDiv.querySelectorAll("ul:nth-of-type(2) li")).map(li => li.innerText);
    const suggestions = Array.from(tempDiv.querySelectorAll("ul:nth-of-type(3) li")).map(li => li.innerText);

    // const standaloneText = tempDiv.innerHTML.split("<br/>").map(text => text.trim()).filter(text => text && !text.startsWith("<"));
    // if (standaloneText.length > 0) {
    //     suggestions.push(...standaloneText);
    // }

    return { keyTakeaways, potentialTargetMarkets, suggestions };
}

export default function AnalyzeResult({ simulationId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [parsedRemark, setParsedRemark] = useState(null);

    useEffect(() => {
        const getConversation = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/conversation/analyze?simulationId=${simulationId}`)

                if (!response.ok) {
                    throw new Error(response.error)
                }

                const fetchedData = await response.json()

                console.log("Fetched Data:", fetchedData); 
    
                const formattedData = Object.keys(fetchedData.analyticsResult.groupLikelihoods).map(key => {
                    return {
                        group: key.split("|")[0].replace("Age:", ""),  
                        likelihood: fetchedData.analyticsResult.groupLikelihoods[key].averageLikelihood.toFixed(2)
                    };
                });
    
                console.log("Formatted Chart Data:", formattedData); 
                setData({ ...fetchedData, analyticsResult: { ...fetchedData.analyticsResult, groupLikelihoods: formattedData } });

            } catch (error) {
                console.log("Error fetching data:", error)
                toast(error)
                console.log("toasted")
            } finally {
                setLoading(false)
            }
        }
        getConversation()
    }, [simulationId]);
    
    
    useEffect(() => {
        if (data && data.analyticsResult?.geminiRemark) {
            setParsedRemark(parseGeminiRemark(data?.analyticsResult?.geminiRemark));
        }
    }, [data]);

    if (loading) return <p>Loading analysis...</p>;

    console.log("Chart Data:", data?.analyticsResult?.groupLikelihoods);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Analysis Result</h2>
            <div className="w-full flex md:flex-row md:justify-between flex-col justify-start gap-4 items-center">
            
                <div className="md:w-[1/2] w-full h-[300px]"> 
                    {data?.analyticsResult?.groupLikelihoods?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.analyticsResult?.groupLikelihoods}>
                                <XAxis dataKey="group" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="likelihood" fill="#4f46e5" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500">No data available for chart</p>
                    )}
                </div>

                {parsedRemark && (
                    <div className="md:w-1/2 w-full  p-4 bg-[#FFFCF6] border-l-4 text-gray-700 rounded-lg ">
                        {/* <h3 className="text-lg font-semibold text-blue-700">Gemini’s Remark</h3> */}

                        <div className="text-gray-700 mt-2">
                            {parsedRemark.keyTakeaways.length > 0 && (
                                <>
                                    <strong>Key Takeaways:</strong>
                                    <ul className="list-disc pl-4">
                                        {parsedRemark.keyTakeaways.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {parsedRemark.potentialTargetMarkets.length > 0 && (
                                <>
                                    <strong>Potential Target Markets:</strong>
                                    <ul className="list-disc pl-4">
                                        {parsedRemark.potentialTargetMarkets.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {parsedRemark.suggestions.length > 0 && (
                                <>
                                    <strong>Suggestions:</strong>
                                    <ul className="list-disc pl-4">
                                        {parsedRemark.suggestions.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
