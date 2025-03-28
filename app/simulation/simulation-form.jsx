"use client";

import { useState } from "react";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Textarea } from "../../@/components/ui/textarea";
import AgentModal from "./agent-modal";

export default function SimulationForm({ onStartSimulation }) {
    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
        productCost: 0,
        exposureMessage: "",
        numberOfTurns: 10,
        demographics: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addAgentGroup = (agentGroup) => {
        setFormData((prev) => ({
            ...prev,
            demographics: [...prev.demographics, agentGroup],
        }));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Enter Simulation Details</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <Input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="mb-3" />
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
            <Textarea name="productDescription" placeholder="Product Description" value={formData.productDescription} onChange={handleChange} className="mb-3" />
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Cost</label>
            <Input name="productCost" type="number" placeholder="Product Cost" value={formData.productCost} onChange={handleChange} className="mb-3" />
            <label className="block text-sm font-medium text-gray-700 mb-2">Exposure Message</label>
            <Textarea name="exposureMessage" placeholder="Exposure Message" value={formData.exposureMessage} onChange={handleChange} className="mb-3" />
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Turns</label>
            <Input name="numberOfTurns" type="number" placeholder="Number of Turns" value={formData.numberOfTurns} onChange={handleChange} className="mb-3" />

            <Button onClick={() => setIsModalOpen(true)} className="w-full mb-3">+ Add Agent Group</Button>

            {formData.demographics.length > 0 && (
                <ul className="list-disc pl-4 text-sm text-gray-700">
                    {formData.demographics.map((group, index) => (
                        <li key={index}>Group {index + 1} - Count: {group.count}</li>
                    ))}
                </ul>
            )}

            <Button onClick={() => onStartSimulation(formData)} className="w-full mt-4">Start Simulation</Button>

            {isModalOpen && <AgentModal onClose={() => setIsModalOpen(false)} onSave={addAgentGroup}  />}
        </div>
    );
}
