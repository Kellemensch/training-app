"use client";

import { Training } from "@/lib/interfaces";
import { useCallback, useEffect, useState } from "react";
import ExerciseTimer from "./ExerciseTimer";
import ExerciseRepetitions from "./ExerciseRepetitions";
import { useRouter } from "next/navigation";
import ButtonCancelTraining from "./ButtonCancelTraining";
import { useTrainings } from "@/hooks/useTrainings";

interface StartTrainingClientProps {
    trainingId: string;
}

export default function StartTrainingClient({trainingId}: StartTrainingClientProps) {
    const {trainings, isLoading, updateTraining} = useTrainings();

    const router = useRouter();
    const [training, setTraining] = useState<Training>();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [trainingComplete, setTrainingComplete] = useState(false);

    useEffect(() => {
        if (!isLoading && trainings.length > 0) {
            console.log("Trainings disponibles:", trainings);
            console.log("Recherche training ID:", trainingId);
            
            const findTraining = trainings.find((t) => t.id === trainingId);
            console.log("Training trouvé:", findTraining);
            
            if (findTraining) {
                setTraining(findTraining);
            }
        }
    }, [trainings, trainingId, isLoading]);

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
        updateTraining(training.id, updatedTraining);
        setTrainingComplete(true);
    }, [training, updateTraining]);
    

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Chargement de l'entraînement...</p>
            </div>
        );
    }


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

            <ButtonCancelTraining/>
        </div>
    )
}