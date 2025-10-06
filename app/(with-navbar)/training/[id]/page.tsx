import TrainingPage from "@/components/TrainingPage";

interface TrainingProps {
    params: {id: string};
}

export default async function Training({params}: TrainingProps) {
    const {id} = await params;
    return (
        <div>
            <h1 className="text-center font-bold text-black">Ton entraînement</h1>
            <TrainingPage id={params.id} />
        </div>
    )
}