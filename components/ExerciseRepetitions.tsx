"use client";

import ButtonNextExercise from "./ButtonNextExercise";

interface ExerciseRepetitionsProps {
    nb: number;
    onComplete: () => void;
}

export default function ExerciseRepetitions({nb, onComplete}: ExerciseRepetitionsProps) {
    return (
        <div>
            <p className="text-6xl font-bold p-10">{nb} répétitions</p>
            <ButtonNextExercise onComplete={onComplete}/>
        </div>
    )
}