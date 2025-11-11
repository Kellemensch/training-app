"use client";

import { Training } from "@/lib/interfaces";
import { useEffect, useMemo, useState } from "react";
import TrainingCard from "./TrainingCard";
import { useTrainings } from "@/hooks/useTrainings";
import ButtonStartTraining from "./ButtonStartTraining";
import Loading from "@/app/loading";
import HistoryCard from "./HistoryCard";
import { useRouter } from "next/navigation";

export default function HistoryList() {
  const { trainings, isLoading, deleteTraining, historyTrainings } =
    useTrainings();

  const router = useRouter();

  // Helpers to normalize history entries to Date
  const parseDate = (d: string | Date) =>
    typeof d === "string" ? new Date(d) : d;

  // Compute start of current week (Monday) and start of month
  const now = new Date();
  const startOfWeek = new Date(now);
  // getDay(): 0 (Sun) .. 6 (Sat). Convert so Monday is 0
  const dayIndex = (now.getDay() + 6) % 7;
  startOfWeek.setDate(now.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  // Prepare list of trainings with lastActivity and parsed history
  const trainingsWithMeta = useMemo(() => {
    return historyTrainings
      .map((t) => {
        const parsedHistory = (t.history || []).map((h) => parseDate(h));
        const lastActivity = parsedHistory.length
          ? parsedHistory.reduce((a, b) => (a > b ? a : b))
          : null;
        return { training: t, parsedHistory, lastActivity };
      })
      .filter((t) => t.lastActivity !== null)
      .sort(
        (a, b) =>
          (b.lastActivity as Date).getTime() -
          (a.lastActivity as Date).getTime()
      );
  }, [historyTrainings]);

  if (isLoading) return <Loading />;

  if (historyTrainings.length === 0)
    return (
      <div>
        <h1 className="text-center p-3 text-2xl font-extralight">
          Pas d'entraînements effectués
        </h1>
        <div className="p-4 text-center">
          <ButtonStartTraining />
        </div>
      </div>
    );

  return (
    <div>
      <div className="p-3">
        {trainingsWithMeta.map((training, index) => (
          <div key={index} className="p-2">
            <HistoryCard
              key={training.training.id}
              training={training.training}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
