"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";
import { useTrainings } from "@/hooks/useTrainings";

export default function HistoryList() {
    const {trainings, isLoading, deleteTraining} = useTrainings();
    const [trainingsDone, setTrainingsDone] = useState<Training[]>([]);

    useEffect(() => {
        if (!isLoading && trainings.length > 0) {
            const filterTraining = trainings.filter((e) => e.history && e.history.length > 0);
            if (filterTraining) {
                setTrainingsDone(filterTraining);
                console.log(filterTraining);
            }
        }
    }, [trainings, isLoading]);

    if (trainingsDone.length === 0) return (
        <div>
            <h1 className="text-center p-3 text-2xl font-extralight">Pas d'entraînements effectués</h1>
        </div>
    )

    return (
        <div>
            <div className="columns-4 gap-5">
                {trainingsDone.map((training, index) => (
                    <div key={index} className="flex">
                    <TrainingCard key={training.id} training={training} param={"check"} onTrainingDeleted={deleteTraining}/>
                    <p className="text-gray-400 font-light">Historique: {training.history?.map((e) => {return `${e.toString().split('T')[0]} `})}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}