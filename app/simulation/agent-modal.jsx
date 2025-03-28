"use client";

import { useState } from "react";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../@/components/ui/dialog";

export default function AgentModal({ onClose, onSave }) {
    const [agentGroup, setAgentGroup] = useState({
        occupation: [],
        ageRange: [],
        gender: [],
        incomeRange: [],
        count: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgentGroup((prev) => ({
            ...prev,
            [name]: value.split(",").map((item) => item.trim()), 
        }));
    };

    const handleAgeChange = (e, index, field) => {
        const updatedAges = [...agentGroup.ageRange];
        updatedAges[index] = { ...updatedAges[index], [field]: Number(e.target.value) };
        setAgentGroup({ ...agentGroup, ageRange: updatedAges });
    };

    const handleIncomeChange = (e, index, field) => {
        const updatedIncome = [...agentGroup.incomeRange];
        updatedIncome[index] = { ...updatedIncome[index], [field]: Number(e.target.value) };
        setAgentGroup({ ...agentGroup, incomeRange: updatedIncome });
    };

    const handleSubmit = () => {
        onSave(agentGroup);
        onClose();
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>Add Agent Group</DialogTitle>
                </DialogHeader>

                <label className="block mb-1">Occupations (comma-separated)</label>
                <Input name="occupation" onChange={handleChange} placeholder="e.g., Engineer, Doctor" />

                <label className="block mt-2 ">Age Range (Min-Max)</label>
                <div className="flex space-x-2">
                    <Input type="number" placeholder="Min Age" onChange={(e) => handleAgeChange(e, 0, "min")} />
                    <Input type="number" placeholder="Max Age" onChange={(e) => handleAgeChange(e, 0, "max")} />
                </div>

                <label className="block mt-2 ">Gender (comma-separated)</label>
                <Input name="gender" onChange={handleChange} placeholder="e.g., Male, Female, Non-binary" />

                <label className="block mt-2">Income Range (Min-Max)</label>
                <div className="flex space-x-2">
                    <div className="relative w-full">
                    <span className="absolute left-0 top-0 h-full w-8 flex items-center justify-center bg-gray-200 text-gray-500 border border-gray-300 rounded-l-md">
                            $
                        </span>
                        <Input type="number" className="pl-10 rounded-r-md" placeholder="Min Income" onChange={(e) => handleIncomeChange(e, 0, "min")} />
                    </div>
                    <div className="relative w-full">
                        <span className="absolute left-0 top-0 h-full w-8 flex items-center justify-center bg-gray-200 text-gray-500 border border-gray-300 rounded-l-md">
                            $
                        </span>
                        <Input
                            type="number"
                            className="pl-10 rounded-r-md"
                            placeholder="Max Income"
                            onChange={(e) => handleIncomeChange(e, 0, "max")}
                        />
                    </div>

                </div>


                <label className="block mt-1">Count</label>
                <Input type="number" name="count" onChange={(e) => setAgentGroup({ ...agentGroup, count: Number(e.target.value) })} />

                <Button onClick={handleSubmit} className="w-full mt-4">
                    Save
                </Button>
            </DialogContent>
        </Dialog>
    );
}
