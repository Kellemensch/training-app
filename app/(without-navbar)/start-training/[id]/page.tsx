import StartTrainingClient from "@/components/StartTrainingClient";

interface TrainingProps {
    params: {id: string};
}

export default async function StartTraining({params}: TrainingProps) {
    const {id} = await params;

    return (
        <StartTrainingClient trainingId={id}/>
    )
}