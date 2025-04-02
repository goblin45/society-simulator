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
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
         
            <div className="relative w-full max-w-xl md:max-w-3xl p-6 bg-[#FFFCF6] border border-gray-300 shadow-lg rounded-lg space-y-2">
                <div className ="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold text-green-950">Simulation Form</h2>
                    <Button onClick={() => router.push("/")} className="block z-50 border cursor-pointer">
                         Back
                    </Button>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-green-950">Product Name</label>
                    <Input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required />

                    <label className="block text-sm font-medium text-green-950">Product Description</label>
                    <Textarea name="productDescription" placeholder="Product Description" value={formData.productDescription} onChange={handleChange} required />

                    <label className="block text-sm font-medium text-green-950">Product Cost</label>
                    <Input name="productCost" type="number" placeholder="Product Cost" value={formData.productCost} onChange={handleChange} required />

                    <label className="block text-sm font-medium text-green-950">Exposure Message</label>
                    <Textarea name="exposureMessage" placeholder="Exposure Message" value={formData.exposureMessage} onChange={handleChange} required />

                    <label className="block text-sm font-medium text-green-950">Number of Turns</label>
                    <Input name="numberOfTurns" type="number" placeholder="Number of Turns" value={formData.numberOfTurns} onChange={handleChange} required min={1} max={3} />

                    {formData.demographics.length > 0 && (
                        <>
                            <span className="font-semibold text-green-950 mb-3">Agent Groups:</span>
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

                    <Button onClick={handleAgentModalOpen} className="w-full bg-green-950 hover:bg-gray-800 font-semibold cursor-pointer">
                        + Add Agent Group
                    </Button>

                    <Button 
                        type="submit" 
                        className={`w-full text-white font-semibold flex items-center justify-center cursor-pointer
                            ${!formValid ? "bg-gray-400 cursor-not-allowed" : "bg-green-950 hover:bg-gray-800"}`}
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
