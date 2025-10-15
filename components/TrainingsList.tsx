"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";
import { useTrainings } from "@/hooks/useTrainings";

interface TrainingListProps {
    param: string;
}

export default function TrainingsList({param}: TrainingListProps) {
    const {trainings, deleteTraining} = useTrainings();

    const handleTrainingDeleted = (trainingId: string) => {
        console.log("Training supprimé");
        deleteTraining(trainingId);
    }

    return (
        <div>
            {trainings.length != 0
                ? (<div className="columns-1 md:columns-2 lg:columns-3 gap-2 md:gap-3 lg:gap-5">
                    {trainings.map((training) => (
                        <TrainingCard key={training.id} training={training} param={param} onTrainingDeleted={handleTrainingDeleted}/>
                    ))}
                </div>)
                : (<p>Aucun entraînement de créé.</p>)
            }

        </div>
    )
}