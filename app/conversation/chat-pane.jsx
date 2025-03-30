"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ChatPane({ simulationId }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState();

    useEffect(() => {
        const getConversation = async() => {
            setLoading(true)
            try {
                const response = await fetch(`/api/conversation?simulationId=${simulationId}`)

                if (!response.ok) {
                    throw new Error(response.error)
                }

                const data = await response.json()
                setMessages(data.conversation);  

            } catch (error) {
                console.log('Error: ', error)
                toast(error)
            } finally {
                setLoading(false)
            }
        }
        getConversation()
    }, [simulationId]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Conversation</h2>
            {loading ? <p>Loading chat...</p> : (
                <div className="space-y-2">
                    {messages?.length === 0 ?  
                        <span>No message found in this simulation!</span>
                    :   messages?.map((msg, index) => (
                        <div key={index} className="p-2 bg-[#FFFCF6] text-gray-700 rounded-lg shadow-sm">
                            <strong>{msg.sender}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
