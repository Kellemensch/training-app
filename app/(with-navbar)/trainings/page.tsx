import ButtonTraining from "@/components/ButtonTraining";
import TrainingsList from "@/components/TrainingsList";

export default function Entrainements() {
    return (
        <div>
            <h1 className="font-bold text-4xl text-center p-4 mb-5 text-shadow-bleu-canard text-shadow-2xs">Tes entraînements</h1>
            <TrainingsList param={"check"}/>
            <div className="fixed right-10 bottom-10">
                <ButtonTraining/>
            </div>
        </div>
    )
}