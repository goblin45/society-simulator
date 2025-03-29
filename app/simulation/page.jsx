"use client";

import { useRouter } from "next/navigation";
import SimulationForm from "./simulation-form";

export default function SimulationPage() {
    const router = useRouter()
    const onStartSimulation = async(formData) => {
        
        try{
            const response = await fetch(`/api/simulation/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)  

            });
            const data = await response.json();
            console.log(data)
            if(data.simulation._id)
            {router.push(`/conversation/${data.simulation._id}`);}
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
       <div className="container mx-auto py-10">
        <SimulationForm onStartSimulation={onStartSimulation}/>
       </div>
    )
}