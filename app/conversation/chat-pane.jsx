"use client";

import { useState, useEffect } from "react";

export default function ChatPane({ simulationId }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/simulation/${simulationId}`)
            .then((res) => res.json())
            .then((data) => {
                setMessages(data.chat);
                setLoading(false);
            });
    }, [simulationId]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Conversation</h2>
            {loading ? <p>Loading chat...</p> : (
                <div className="space-y-2">
                    {messages.map((msg, index) => (
                        <div key={index} className="p-2 bg-white rounded-lg shadow-sm">{msg}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
