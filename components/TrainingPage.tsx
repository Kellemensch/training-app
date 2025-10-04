"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";

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
        <div>
            {training 
                ? (
                    <>
                        <h2>Nom: {training.name}</h2>
                        {training?.exercises.length != 0 
                            ? (
                                <div>
                                    {training?.exercises.map((exercise, index) => (
                                        <>
                                            <h3 key={index}>Exercice {index+1}</h3>
                                            <p>Type: {exercise.type}</p>
                                            {exercise.type === "Temps" && <p>Durée: {exercise.time}</p>}
                                            {exercise.type === "Repetitions" && <p>Répétitions: {exercise.repetitions}</p>}
                                        </>
                                    ))}
                                </div>
                            )
                            : <p>Pas d'exercices</p>
                        }
                    </>
                )
                : <h2>404 error: Pas d'entraînement trouvé</h2>
            }
        </div>
    )
}