import TrainingPage from "@/components/TrainingPage";

interface TrainingProps {
    params: {id: string};
}

export default function Training({params}: TrainingProps) {
    return (
        <div>
            <h1 className="text-center font-bold text-black">Ton entraînement</h1>
            <TrainingPage id={params.id} />
        </div>
    )
}