import TrainingsList from "@/components/TrainingsList";

export default function StartTrainingChoose() {
    return (
        <div>
            <h1 className="text-center">Quel entraînement commencer?</h1>
            <TrainingsList param={"start"}/>
        </div>
    )
}