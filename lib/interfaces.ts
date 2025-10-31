export interface Exercise {
    id: string;
    name: string;
    description: string;
    type: string;
    repetitions?: string;
    time?: string;
}

export interface Training {
    id: string;
    name: string;
    description: string;
    day: string;
    exercises: Exercise[];
    history?: Date[];
    emoji: string;
};

export interface Program {
    id: string;
    name: string;
    description: string;
    trainings: Training[];
};

export interface ScheduledTraining {
    id: string;
    trainingId: string;
    trainingName: string;
    date: string; // Format YYYY-MM-DD
    notification: boolean;
    notificationTime?: string;
    emoji: string;
}