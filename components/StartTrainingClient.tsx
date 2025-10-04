"use client";

import { Training } from "@/lib/interfaces";
import { useCallback, useEffect, useState } from "react";
import ExerciseTimer from "./ExerciseTimer";
import ExerciseRepetitions from "./ExerciseRepetitions";

interface StartTrainingClientProps {
    trainingId: string;
}

export default function StartTrainingClient({trainingId}: StartTrainingClientProps) {
    const [training, setTraining] = useState<Training>();

    const [currentIndex, setCurrentIndex] = useState(0);

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
    

    const handleNextExercise = useCallback(() => {
        if (training && currentIndex < training.exercises.length -1) {
            setCurrentIndex(e => e + 1);
        }
    }, [currentIndex, training]);

    const handleExerciseComplete = useCallback(() => {
        handleNextExercise();
    }, [handleNextExercise])


    if (!training) return <p>Cet entraînement n'a pas été trouvé</p>
    
    const currentExercise = training?.exercises[currentIndex];
    if (!currentExercise) return <p>Pas d'exercice dans cet entraînement</p>

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