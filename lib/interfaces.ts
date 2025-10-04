export interface Exercise {
    id: string;
    name: string;
    type: string;
    repetitions?: string;
    time?: string;
}

export interface Training {
    id: string;
    name: string;
    day: string;
    exercises: Exercise[];
};

export interface Program {
    id: string;
    name: string;
    description: string;
    trainings: Training[];
};