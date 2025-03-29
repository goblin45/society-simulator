"use client";

import { useState } from "react";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Textarea } from "../../@/components/ui/textarea";
import AgentModal from "./agent-modal";
import { TrashIcon } from "lucide-react";

export default function SimulationForm({ onStartSimulation }) {
    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
        productCost: 0,
        exposureMessage: "",
        numberOfTurns: 0,
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

    const deleteAgentGroup = (agentGroup) => {
        setFormData((prev) => ({
            ...prev,
            demographics: formData.demographics.filter((demo) => JSON.stringify(demo) !== JSON.stringify(agentGroup))
        }))
    }

    const handleAgentModalOpen = (e) => {
        e.preventDefault()
        setIsModalOpen(true)
    }

    return (
        <form className="max-w-lg mx-auto p-6 bg-white border border-gray-200 shadow-md rounded-lg space-y-1" onSubmit={(e) => {
            e.preventDefault()
            onStartSimulation(formData)
        }}>
            <h2 className="text-xl font-bold mb-4">Enter Simulation Details</h2>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <Input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="mb-3" required/>
            <label className="block text-sm font-medium text-gray-700">Product Description</label>
            <Textarea name="productDescription" placeholder="Product Description" value={formData.productDescription} onChange={handleChange} className="mb-3" required/>
            <label className="block text-sm font-medium text-gray-700">Product Cost</label>
            <Input name="productCost" type="number" placeholder="Product Cost" value={formData.productCost} onChange={handleChange} className="mb-3"  required/>
            <label className="block text-sm font-medium text-gray-700">Exposure Message</label>
            <Textarea name="exposureMessage" placeholder="Exposure Message" value={formData.exposureMessage} onChange={handleChange} className="mb-3" required/>
            <label className="block text-sm font-medium text-gray-700">Number of Turns</label>
            <Input name="numberOfTurns" type="number" placeholder="Number of Turns" value={formData.numberOfTurns} onChange={handleChange} className="mb-3" required min={1} max={3}/>

            {formData.demographics?.length > 0 && (
                <span className="font-semibold text-base">Agent groups for this simulation:</span>
            )}
            {formData.demographics.length > 0 && formData.demographics.map((group, index) => (
                <div key={index} className="p-2 my-2 text-sm text-gray-700 bg-gray-200 border border-gray-400 rounded-lg flex items-center justify-between">
                    <div className="space-y-2">
                        <h5 className="font-medium">Group {index+1}</h5>
                        <ul className="list-disc pl-4">
                            {
                                group.occupation && group.occupation?.length > 0 && (
                                    <li>Occupation: {group.occupation}</li>
                                )
                            }
                            {
                                group.ageRange && Object.keys(group.ageRange)?.length > 0 && (
                                    <li>Age Range: {group.ageRange[0].min} - {group.ageRange[0].max}</li>
                                )
                            }
                            {
                                group.incomeRange && Object.keys(group.incomeRange)?.length > 0 && (
                                    <li>Income Range: ${group.incomeRange[0].min} - ${group.incomeRange[0].max}</li>
                                )
                            }
                            {
                                group.gender && group.gender?.length > 0 && (
                                    <li>Gender: {group.gender}</li>
                                )
                            }
                            <li>No. of members: {group.count}</li>
                        </ul>
                    </div>
                    <Button onClick={() => deleteAgentGroup(group)}><TrashIcon/></Button>
                </div>
            ))}

            <Button onClick={handleAgentModalOpen} className="w-full">+ Add Agent Group</Button>
            <Button type="submit" className="w-full mt-1">Start Simulation</Button>

            {isModalOpen && <AgentModal onClose={() => setIsModalOpen(false)} onSave={addAgentGroup}  />}
        </form>
    );
}
