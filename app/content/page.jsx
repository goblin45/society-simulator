"use client";

import { useState } from "react";
import { Textarea } from "../components/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/dropdown-menu";

export default function Content() {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [counts, setCounts] = useState({ doctor: 0, farmer: 0 });

    const roles = ["Doctor", "Farmer"];

    const handleRoleSelection = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleCountChange = (role, value) => {
        setCounts((prev) => ({ ...prev, [role.toLowerCase()]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center gap-6 bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            {/* Business Idea Input */}
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
                <h1 className="text-xl font-bold mb-4 text-center">Enter Your Business Ideas</h1>
                <Textarea className="w-full mb-4" />
            </div>

         
            <div className="bg-white shadow-lg rounded-lg p-4 w-72">
                <h1 className="text-lg font-medium">Select Community Size</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full bg-gray-200 px-4 py-2 rounded-md text-center">
                        Select
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Array.from({ length: 10 }, (_, i) => (
                            <DropdownMenuItem key={i + 1}>{i + 1}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Personality Dropdown */}
            <div className="bg-white shadow-lg rounded-lg p-4 w-72">
                <h1 className="text-lg font-medium">Select Personality</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full bg-gray-200 px-4 py-2 rounded-md text-center">
                        Select
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Roles</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {roles.map((role) => (
                            <DropdownMenuItem key={role} onSelect={() => handleRoleSelection(role)}>
                                {role}{selectedRoles.includes(role) ? "✔ " : ""} 
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        
            {selectedRoles.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg p-4 w-72 mt-2">
                    <h1 className="text-lg font-medium">Specify Numbers</h1>
                    <div className="flex flex-col gap-3 mt-2">
                        {selectedRoles.includes("Doctor") && (
                           <>
                           <label>No of doctors</label>
                            <input
                                type="number"
                                placeholder="No. of Doctors"
                                value={counts.doctor}
                                onChange={(e) => handleCountChange("Doctor", e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                           </>
                        )}
                        {selectedRoles.includes("Farmer") && (
                           <>
                           <label>No of farmers</label>
                            <input
                                type="number"
                                placeholder="No. of Farmers"
                                value={counts.farmer}
                                onChange={(e) => handleCountChange("Farmer", e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                           </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
