"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ChatPane({ simulationId }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getConversation = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/conversation?simulationId=${simulationId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch conversation");
                }

                const data = await response.json();
                setMessages(data.conversation);
            } catch (error) {
                console.log("Error: ", error);
                toast(error.message);
            } finally {
                setLoading(false);
            }
        };
        getConversation();
    }, [simulationId]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Conversation</h2>
            {loading ? (
                <p>Loading chat...</p>
            ) : (
                <div className="space-y-2 flex flex-col">
                    {messages?.length === 0 ? (
                        <span>No message found in this simulation!</span>
                    ) : (
                        messages?.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 max-w-[70%] text-green-950 rounded-lg shadow-sm ${
                                    index % 2 === 0
                                        ? "bg-[#FFFCF6]  self-start" 
                                        : "bg-[#faedd3] self-end" 
                                }`}
                            >
                                <strong >{msg.sender}:</strong> {msg.content}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
