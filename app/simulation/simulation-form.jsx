"use client";

import { useState, useEffect } from "react";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Textarea } from "../../@/components/ui/textarea";
import AgentModal from "./agent-modal";
import { TrashIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; 

export default function SimulationForm({ onStartSimulation }) {
    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
        productCost: "",
        exposureMessage: "",
        numberOfTurns: "",
        demographics: [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if all fields are filled and at least one agent group is added
        const isComplete = 
            formData.productName.trim() !== "" &&
            formData.productDescription.trim() !== "" &&
            formData.productCost !== "" &&
            formData.exposureMessage.trim() !== "" &&
            formData.numberOfTurns !== "" &&
            formData.demographics.length > 0;

        setFormValid(isComplete);
    }, [formData]);

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
            demographics: prev.demographics.filter((demo) => JSON.stringify(demo) !== JSON.stringify(agentGroup)),
        }));
    };

    const handleAgentModalOpen = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await onStartSimulation(formData);

        setLoading(false);
    };

    return (
        <div>
            <Button onClick={() => router.push("/")} className="absolute top-10 left-3">
                Back
            </Button>
            <div className="relative max-w-3xl min-h-screen  mx-auto p-6 bg-[#FFFCF6] border border-gray-300 shadow-lg rounded-lg space-y-2">
           

            <h2 className="text-2xl font-bold text-gray-700 text-center">Enter Simulation Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <Input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required />

                <label className="block text-sm font-medium text-gray-700">Product Description</label>
                <Textarea name="productDescription" placeholder="Product Description" value={formData.productDescription} onChange={handleChange} required />

                <label className="block text-sm font-medium text-gray-700">Product Cost</label>
                <Input name="productCost" type="number" placeholder="Product Cost" value={formData.productCost} onChange={handleChange} required />

                <label className="block text-sm font-medium text-gray-700">Exposure Message</label>
                <Textarea name="exposureMessage" placeholder="Exposure Message" value={formData.exposureMessage} onChange={handleChange} required />

                <label className="block text-sm font-medium text-gray-700">Number of Turns</label>
                <Input name="numberOfTurns" type="number" placeholder="Number of Turns" value={formData.numberOfTurns} onChange={handleChange} required min={1} max={3} />

                {/* Agent Groups Display */}
                {formData.demographics.length > 0 && (
                    <>
                        <span className="font-semibold text-gray-700">Agent Groups:</span>
                        {formData.demographics.map((group, index) => (
                            <div key={index} className="p-2 bg-gray-200 rounded-lg flex justify-between items-center">
                                <div>
                                    <h5 className="font-medium">Group {index + 1}</h5>
                                    <ul className="list-disc pl-4 text-sm">
                                        {group.occupation && <li>Occupation: {group.occupation}</li>}
                                        {group.ageRange && <li>Age: {group.ageRange[0].min} - {group.ageRange[0].max}</li>}
                                        {group.incomeRange && <li>Income: ${group.incomeRange[0].min} - ${group.incomeRange[0].max}</li>}
                                        {group.gender && <li>Gender: {group.gender}</li>}
                                        <li>No. of members: {group.count}</li>
                                    </ul>
                                </div>
                                <Button onClick={() => deleteAgentGroup(group)} variant="ghost">
                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </>
                )}

                {/* Buttons */}
                <Button onClick={handleAgentModalOpen} className="w-full bg-gray-700 hover:bg-gray-800  font-semibold cursor-pointer">
                    + Add Agent Group
                </Button>

                <Button 
    type="submit" 
    className={`w-full text-white font-semibold flex items-center justify-center cursor-pointer
        ${!formValid ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"}`}
    disabled={!formValid || loading}
>
    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Start Simulation"}
</Button>

            </form>

            {isModalOpen && <AgentModal onClose={() => setIsModalOpen(false)} onSave={addAgentGroup} />}
        </div>
        </div>
    );
}
