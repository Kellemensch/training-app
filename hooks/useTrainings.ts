import { ScheduledTraining, Training } from "@/lib/interfaces";
import { useEffect, useState } from "react";

export function useTrainings() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [scheduledTrainings, setScheduledTrainings] = useState<ScheduledTraining[]>([]);

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
        
        const loadScheduledTrainings = () => {
            try {
                const storedScheduled = localStorage.getItem("scheduled-trainings");
                if (storedScheduled) {
                    const parsedScheduled: ScheduledTraining[] = JSON.parse(storedScheduled);
                    setScheduledTrainings(parsedScheduled);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des scheduled trainings:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadTrainings();
        loadScheduledTrainings();
    }, []);

    const deleteTraining = (trainingId: string) => {
        const updatedTrainings = trainings.filter((t) => t.id != trainingId);
        setTrainings(updatedTrainings);
        localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
        return true;
    };

    const deleteScheduledTraining = (trainingId: string) => {
        const updatedTrainings = scheduledTrainings.filter((t) => t.id != trainingId);
        setScheduledTrainings(updatedTrainings);
        localStorage.setItem("scheduled-trainings", JSON.stringify(updatedTrainings));
        return true;
    }

    const addTraining = (training: Training) => {
        const updatedTrainings = [...trainings, training];
        setTrainings(updatedTrainings);
        localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
    };

    const addScheduledTraining = (training: ScheduledTraining) => {
        const updatedTrainings = [...scheduledTrainings, training];
        setScheduledTrainings(updatedTrainings);
        localStorage.setItem("scheduled-trainings", JSON.stringify(updatedTrainings));
    }

    const updateTraining = (trainingId: string, updatedTraining: Training) => {
        const updatedTrainings = trainings.map((t) => t.id === trainingId ? updatedTraining : t);
        setTrainings(updatedTrainings);
        localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
    };

    const updateScheduledTraining = (trainingId: string, updatedTraining: ScheduledTraining) => {
        const updatedTrainings = scheduledTrainings.map((t) => t.id === trainingId ? updatedTraining : t);
        setScheduledTrainings(updatedTrainings);
        localStorage.setItem("scheduled-trainings", JSON.stringify(updatedTrainings));
    }

    return {
        trainings,
        isLoading,
        deleteTraining,
        addTraining,
        updateTraining,
        scheduledTrainings,
        deleteScheduledTraining,
        addScheduledTraining,
        updateScheduledTraining
    };
}