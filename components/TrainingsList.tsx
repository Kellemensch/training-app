"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";

export default function TrainingsList({param}) {
    const [trainings, setTrainings] = useState<Training[]>([]);

    useEffect(() => {
        const storedTrainings = localStorage.getItem('trainings');
        if (storedTrainings) setTrainings(JSON.parse(storedTrainings));
    }, []);

    return (
        <div>
            {trainings.length != 0
                ? (<div className="columns-5 gap-5">
                    {trainings.map((training) => (
                        <TrainingCard key={training.id} training={training} param={param}/>
                    ))}
                </div>)
                : (<p>Aucun entraînement de créé.</p>)
            }

        </div>
    )
}