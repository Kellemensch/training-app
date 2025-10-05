"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";

export default function HistoryList() {
    const [trainingsDone, setTrainingsDone] = useState<Training[]>([]);

    useEffect(() => {
        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) {
            const parsedTrainings: Training[] = JSON.parse(storedTrainings);
            console.log(parsedTrainings);
            const filterTraining = parsedTrainings.filter((e) => e.history && e.history.length > 0);
            if (filterTraining) {
                setTrainingsDone(filterTraining);
                console.log(filterTraining);
            }
        }
    }, []);

    if (trainingsDone.length === 0) return (
        <div>
            <h1 className="text-center">Pas d'entraînements d'éffectués</h1>
        </div>
    )

    return (
        <div>
            <div className="columns-5 gap-5">
                {trainingsDone.map((training, index) => (
                    <div key={index}>
                    <TrainingCard key={training.id} training={training} param={"check"}/>
                    <p className="text-gray-400 font-light">Historique complet: {training.history?.map((e) => {return `${e.toString().split('T')[0]} / `})}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}