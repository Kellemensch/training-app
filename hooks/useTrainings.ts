import { Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";

export function useTrainings() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrainings = () => {
            try {
                const storedTrainings = localStorage.getItem("trainings");
                if (storedTrainings) {
                    const parsedTrainings: Training[] = JSON.parse(storedTrainings);
                    setTrainings(parsedTrainings);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des trainings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTrainings();
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
        isLoading,
        deleteTraining,
        addTraining,
        updateTraining
    };
}