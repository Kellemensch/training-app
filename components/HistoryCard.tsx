"use client";

import { useTrainings } from "@/hooks/useTrainings";
import { Training } from "@/lib/interfaces";
import { useRouter } from "next/navigation";

interface HistoryCardProps {
  training: Training;
}

export default function HistoryCard(props: HistoryCardProps) {
  const { historyTrainings } = useTrainings();
  const router = useRouter();
  const training = props.training;

  if (!training || !training.history)
    return <div className="rounded-xl p-4">Not found</div>;

  console.log(training.history);
  const lastTraining = training.history[1];

  // Convert to Date if it's a string
  const dateObj =
    typeof lastTraining === "string" ? new Date(lastTraining) : lastTraining;

  // Format as human-readable date
  const dateTraining = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);

  return (
    <div
      className="flex rounded-xl bg-blue-400/20 p-4 cursor-pointer hover:bg-blue-400/30"
      onClick={() => router.push(`/training/${training.id}`)}
    >
      <span className="text-3xl p-2">{training.emoji}</span>
      <div className="p-2 gap-2 ml-4">
        <h2 className="text-xl text-gray-800">{training.name}</h2>
        <p className="text-gray-500 font-light">{dateTraining}</p>
      </div>
    </div>
  );
}
