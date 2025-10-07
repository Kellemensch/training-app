import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";

export function useTrainings() {
    const [trainings, setTrainings] = useState<Training[]>([]);

    useEffect(() => {
        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) setTrainings(JSON.parse(storedTrainings));
    }, []);

    const deleteTraining = (trainingId: string) => {
        const updatedTrainings = trainings.filter((t) => t.id != trainingId);
        setTrainings(updatedTrainings);
        localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
        return true;
    };

    const addTraining = (training: Training) => {
        const updatedTrainings = [...trainings, training];
        setTrainings(updatedTrainings);
        localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
    };

    const updateTraining = (trainingId: string, updatedTraining: Training) => {
        const updatedTrainings = trainings.map((t) => t.id === trainingId ? updatedTraining : t);
        setTrainings(updatedTrainings);
        localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
    };

    return {
        trainings,
        deleteTraining,
        addTraining,
        updateTraining
    };
}