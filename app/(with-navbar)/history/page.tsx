import HistoryList from "@/components/HistoryList";
import Trendings from "@/components/Trendings";

export default function History() {
  return (
    <div>
      <h1 className="text-center text-4xl font-bold p-3 mb-6">
        Ton historique d'entraînements
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-5 mb-4">
        <Trendings type="week" />
        <Trendings type="month" />
      </div>
      <div className="border border-gray-400 rounded-xl w-auto h-screen m-2 p-4 bg-white">
        <h2 className="font-semibold text-gray-800 text-2xl p-2 mb-5">
          Activité récente
        </h2>
        <HistoryList />
      </div>
    </div>
  );
}
