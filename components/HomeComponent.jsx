"use client";
import { motion } from "framer-motion";
import { Signal, BarChart, Lightbulb } from "lucide-react"; 
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../@/components/ui/card";

import { useRouter } from "next/navigation";
import { content } from "../app/data/CardData";

export default function HomeComponent() {
    const router = useRouter();
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 py-2">
        {content.map((data, index) => {
            const Icon = data.icon;
            return (
                <Card   className="flex-1 min-w-60 bg-[#FFFCF6] min-h-64 p-4 shadow-md border  
                    rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    key={index}>
                    <CardHeader className="flex md:flex-row flex-col items-center gap-3">
                        <Icon className="w-10 h-10 text-green-950" />
                        <CardTitle className="text-lg font-semibold">{data.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-600">
                        <p>{data.content}</p>
                    </CardContent>
                </Card>
            );
        })}
    </div>
    );
}

