"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import ButtonStartThistraining from "./ButtonStartThisTraining";

interface TrainingPageProps {
    id: string;
}

export default function TrainingPage({id}: TrainingPageProps) {
    const [trainings, setTrainings] = useState<Training[]>([]);
    
    useEffect(() => {
        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) setTrainings(JSON.parse(storedTrainings));
    }, []);
    
    const training = trainings.find((e) => e.id === id);
    console.log("params.id:", id, trainings);

    return (
        <div className="p-3 mt-5 text-center">
            {training 
                ? (
                    <div className="flex flex-col p-3">
                        <h2 className="flex text-start text-4xl font-semibold">{training.name} {training.emoji}</h2>
                        <p className="flex text-2xl py-2">{training.description}</p>
                        {training?.exercises.length != 0 
                            ? (
                                <div className="py-2">
                                    {training?.exercises.map((exercise, index) => (
                                        <div key={index} className="text-2xl py-3">
                                            <h3 className="font-semibold text-3xl">Exercice {index+1}</h3>
                                            <p className="">{exercise.description}</p>
                                            {exercise.type === "Temps" && <p>Durée: {exercise.time}</p>}
                                            {exercise.type === "Repetitions" && <p>Répétitions: {exercise.repetitions}</p>}
                                        </div>
                                    ))}
                                </div>
                            )
                            : <p>Pas d'exercices</p>
                        }
                        <ButtonStartThistraining id={id}/>
                    </div>
                )
                : <h2>404 error: Pas d'entraînement trouvé</h2>
            }
        </div>
    )
}