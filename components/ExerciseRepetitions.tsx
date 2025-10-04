"use client";

interface ExerciseRepetitionsProps {
    nb: number;
    onComplete: () => void;
}

export default function ExerciseRepetitions({nb, onComplete}: ExerciseRepetitionsProps) {
    return (
        <div>
            <p>{nb} répétitions</p>
            <button onClick={onComplete} className="cursor-pointer">
                Exercice suivant
            </button>
        </div>
    )
}