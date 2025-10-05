"use client";

import { Training } from "@/lib/interfaces";
import { useCallback, useEffect, useState } from "react";
import ExerciseTimer from "./ExerciseTimer";
import ExerciseRepetitions from "./ExerciseRepetitions";
import { useRouter } from "next/navigation";

interface StartTrainingClientProps {
    trainingId: string;
}

export default function StartTrainingClient({trainingId}: StartTrainingClientProps) {
    const router = useRouter();
    const [training, setTraining] = useState<Training>();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [trainingComplete, setTrainingComplete] = useState(false);

    useEffect(() => {
        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) {
            const parsedTrainings: Training[] = JSON.parse(storedTrainings);
            const findTraining = parsedTrainings.find((e) => e.id === trainingId);
            if (findTraining) {
                setTraining(findTraining);
            }
        }
    }, [trainingId]);

    const handleTrainingComplete = useCallback(() => {
        if (!training) return;

        setTrainingComplete(true);
        const date = new Date();
        const updatedTraining: Training = {
            ...training,
            history: [
                ...(training?.history ?? []),
                date
            ]
        };

        setTraining(updatedTraining);
        setTrainingComplete(true);

        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) {
            const parsedTrainings: Training[] = JSON.parse(storedTrainings);
            const updatedTrainings = parsedTrainings.map(t => 
                t.id === trainingId ? updatedTraining : t
            );
            localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
        }
    }, [training, trainingId]);
    

    const handleNextExercise = useCallback(() => {
        if (training && currentIndex < training.exercises.length -1) {
            setCurrentIndex(e => e + 1);
        } else if (training && currentIndex === training.exercises.length - 1) {
            handleTrainingComplete();
        }
    }, [currentIndex, training, handleTrainingComplete]);

    const handleExerciseComplete = useCallback(() => {
        handleNextExercise();
    }, [handleNextExercise])


    if (!training) return <p>Cet entraînement n'a pas été trouvé</p>
    
    const currentExercise = training?.exercises[currentIndex];
    if (!currentExercise) return <p>Pas d'exercice dans cet entraînement</p>

    if (trainingComplete) return (
        <div>
            <h1>Entraînement fini, bravo!</h1>
            <button onClick={() => router.push("/")} className="cursor-pointer border">
                Retour à l'accueil
            </button>
        </div>
    )

    return (
        <div>
            <p>Exercice {currentIndex + 1} sur {training.exercises.length}</p>
            <div className="text-center">
                <h2>
                    {currentExercise.name}
                </h2>

                {currentExercise.type === "Temps" && currentExercise.time && (
                    <ExerciseTimer duration={currentExercise.time} onComplete={handleExerciseComplete}/>
                )}

                {currentExercise.type == "Repetitions" && currentExercise.repetitions && (
                    <ExerciseRepetitions nb={parseInt(currentExercise.repetitions)} onComplete={handleNextExercise}/>
                )}
            </div>
        </div>
    )
}