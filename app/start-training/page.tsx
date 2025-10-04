import TrainingsList from "@/components/TrainingsList";

export default function StartTrainingChoose() {
    return (
        <div>
            <h1>Quel entraînement commencer?</h1>
            <TrainingsList param={"start"}/>
        </div>
    )
}