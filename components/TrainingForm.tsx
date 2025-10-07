"use client";

import { Exercise, Training } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function TrainingForm() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [training, setTraining] = useState<Training>({
        id: crypto.randomUUID(),
        name: "",
        description: "",
        day: "",
        exercises: [],
        history: [],
        emoji: ""
    });
    const [exercises, setExercises] = useState<Exercise[]>([{
        id: crypto.randomUUID(),
        name: "",
        description: "",
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
        if (training.emoji === "") {
            training.emoji = "🏋";
            setTraining({...training, emoji: "🏋"});
        }
        const newTraining = {...training, exercises: exercises,};
        localStorage.setItem("trainings", JSON.stringify([...trainings, newTraining]));
        alert("Entraînement créé !");
        router.back();
    }

    const addExercise = () => setExercises([...exercises, {id: crypto.randomUUID(), name: "", description: "", type: "", time: "", repetitions: ""}])

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-start p-3">
                <label className="flex-1 font-medium text-2xl mr-5">Nom de l'entraînement :</label>
                <input
                    type="text"
                    value={training?.name}
                    maxLength={100}
                    required
                    onChange={(e) => setTraining({...training, name: e.target.value})}
                    className="border flex-2 rounded p-2 ml-4 mr-50"/>
            </div>
            <div className="flex justify-start p-3">
                <label className="flex-1 text-2xl mr-5 font-medium">Description :</label>
                <textarea
                    maxLength={200}
                    value={training.description}
                    onChange={(e) => setTraining({...training, description: e.target.value})}
                    className="border flex-2 ml-4 mr-50 rounded p-2"/>
            </div>
            <div className="flex p-3">
                <label className="flex text-2xl font-medium mr-5">Choisir un emoji pour cet entraînement:</label>
                <input  
                    type="text"
                    value={training.emoji}
                    placeholder="🏋"
                    maxLength={2}
                    onChange={(e) => setTraining({...training, emoji: e.target.value})}
                    className="border flex mr-50 w-auto rounded p-2 m-2"/>
            </div>
            <div className="space-y-6">
                {exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border rounded-lg p-4 w-[95%] bg-gray-50">
                        <h1 className="font-bold text-xl p-2">Exercice {index + 1} : {exercise.name}</h1>
                        <input 
                            type="text"
                            value={exercise.name}
                            maxLength={100}
                            placeholder="Nom de l'exercice"
                            onChange={(e) => {
                                const newExercises = [...exercises];
                                newExercises[index].name = e.target.value;
                                setExercises(newExercises);
                            }}
                            className="rounded-lg border pb-3 mb-3 w-80"/>
                        <div className="font-semibold text-lg p-1">Type d'exercice</div>
                        <button type="button" 
                            onClick={() => {
                            const newExercises = [...exercises];
                            newExercises[index].type = "Temps";
                            exercise.type = "Temps";
                            setExercises(newExercises);
                            }}
                            className={`cursor-pointer p-4 m-2 rounded-lg ${exercise.type === "Temps"
                                    ? "bg-green-600 border-2 border-green-700 text-white"
                                    : "bg-rose-poudre hover:bg-rose-poudre-hover"
                            }`}>
                                Temps
                        </button>
                        <button type="button"
                            onClick={() => {
                            const newExercises = [...exercises];
                            newExercises[index].type = "Repetitions";
                            exercise.type = "Repetitions";
                            setExercises(newExercises);
                            }}
                            className={`cursor-pointer rounded-lg p-4 m-2 ${exercise.type === "Repetitions"
                                    ? "bg-green-600 border-2 border-green-700 text-white"
                                    : "bg-rose-poudre hover:bg-rose-poudre-hover"
                            }`}>
                                Répétitions
                        </button>
                        {exercise.type && exercise.type === "Temps" && (
                            <div className="flex">
                                <label className="block mb-2 p-3 text-lg font-medium text-gray-900">Définir la durée (en minutes):</label>
                                <input 
                                    type="time" 
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].time = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    className="rounded-lg bg-gray-200 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 flex w-auto text-lg border-gray-400 p-5 hover:bg-gray-400" 
                                    min="00:01" 
                                    max="60:00"
                                    value={exercise.time} 
                                    required/>
                            </div>
                        )}
                        {exercise.type && exercise.type === "Repetitions" && (
                            <div className="flex">
                                <label className="block mb-2 p-3 text-lg font-medium text-gray-900">Définir le nombre de répétitions:</label>
                                <input 
                                    type="number"
                                    value={exercise.repetitions}
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].repetitions = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    className="rounded-lg bg-gray-200 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 flex w-auto text-lg border-gray-400 p-5 hover:bg-gray-300"
                                    required/>
                            </div>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addExercise}
                    className="px-4 py-2 text-lg rounded-lg border cursor-pointer hover:bg-gray-200 flex items-center gap-1"
                >
                    Ajouter un exercice
                </button>
                <div className="text-center">
                    <button
                        type="submit"
                        className="cursor-pointer text-2xl shadow-lg transition-all duration-200 bg-bleu-canard text-white p-5 rounded-2xl hover:bg-bleu-canard-hover"
                    >
                        Créer
                    </button>
                </div>
            </div>
        </form>
    )
}