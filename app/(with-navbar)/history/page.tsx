import HistoryList from "@/components/HistoryList";

export default function History() {
    return (
        <div>
            <h1 className="text-center text-4xl font-bold p-3 mb-6">Ton historique d'entraînements</h1>
            <HistoryList/>
        </div>
    )
}