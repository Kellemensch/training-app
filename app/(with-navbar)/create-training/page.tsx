import TrainingForm from "@/components/TrainingForm";

export default function CreateTraining() {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center p-3 mb-4">
                Créer un entraînement
            </h1>
            <TrainingForm/>
        </div>
    )
}