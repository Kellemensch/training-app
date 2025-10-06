import ButtonTraining from "@/components/ButtonTraining";
import TrainingsList from "@/components/TrainingsList";

export default function Entrainements() {
    return (
        <div>
            <h1 className="font-bold text-4xl text-center">Tes entraînements</h1>
            <TrainingsList param={"check"}/>
            <div className="fixed right-5 bottom-5">
                <ButtonTraining/>
            </div>
        </div>
    )
}