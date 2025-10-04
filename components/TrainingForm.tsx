"use client";

import { Exercise, Training } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function TrainingForm() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [training, setTraining] = useState<Training>({
        id: crypto.randomUUID(),
        name: "",
        day: "",
        exercises: []
    });
    const [exercises, setExercises] = useState<Exercise[]>([{
        id: crypto.randomUUID(),
        name: "",
        type: "",
        time: "",
        repetitions: "0"
    }]);
    const router = useRouter();

    useEffect(() => {
        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) setTrainings(JSON.parse(storedTrainings));
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newTraining = {...training, exercises: exercises,};
        localStorage.setItem("trainings", JSON.stringify([...trainings, newTraining]));
        alert("Entraînement créé !");
        router.back();
    }

    const addExercise = () => setExercises([...exercises, {id: crypto.randomUUID(), name: "", type: "", time: "", repetitions: ""}])

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label className="block font-medium">Nom de l'entraînement</label>
                <input
                    type="text"
                    value={training?.name}
                    onChange={(e) => setTraining({...training, name: e.target.value})}
                    className="border rounded p-2"/>
            </div>
            <div>
                <label className="block font-medium"></label>
            </div>
            <div className="space-y-6">
                {exercises.map((exercise, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <label className="font-bold">Exercice {index+1}</label>
                        <input 
                            type="text"
                            value={exercise.name}
                            placeholder="Nom de l'exercice"
                            onChange={(e) => {
                                const newExercises = [...exercises];
                                newExercises[index].name = e.target.value;
                                setExercises(newExercises);
                            }}
                            className="rounded-lg border pb-3 mb-3"/>
                        <label className="font-semibold">Type d'exercice</label>
                        <button onClick={() => {
                            const newExercises = [...exercises];
                            newExercises[index].type = "Temps";
                            exercise.type = "Temps";
                            setExercises(newExercises);
                            }}
                            className="cursor-pointer bg-green-200 hover:bg-green-300">
                                Temps
                        </button>
                        <button onClick={() => {
                            const newExercises = [...exercises];
                            newExercises[index].type = "Repetitions";
                            exercise.type = "Repetitions"
                            setExercises(newExercises);
                            }}
                            className="cursor-pointer bg-green-200 hover:bg-green-300">
                                Répétitions
                        </button>
                        {exercise.type && exercise.type === "Temps" && (
                            <div className="flex">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Définir la durée (en minutes):</label>
                                <input 
                                    type="time" 
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].time = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    className="rounded-none rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    min="00:01" 
                                    max="60:00"
                                    value={exercise.time} 
                                    required/>
                            </div>
                        )}
                        {exercise.type && exercise.type === "Repetitions" && (
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Définir le nombre de répétitions:</label>
                                <input 
                                    type="number"
                                    value={exercise.repetitions}
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].repetitions = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    required/>
                            </div>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addExercise}
                    className="px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                >
                    Ajouter un exercice
                </button>
                <button
                    type="submit"
                    className="cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Créer
                </button>
            </div>
        </form>
    )
}