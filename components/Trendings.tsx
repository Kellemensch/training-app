"use client";

import { useTrainings } from "@/hooks/useTrainings";
import { useState, useMemo } from "react";
import { BsCalendar4Week } from "react-icons/bs";
import { LuTrendingUp } from "react-icons/lu";

interface TrendingsProps {
  type: string;
}

export default function Trendings(props: TrendingsProps) {
  let icon, header, activity;
  let iconSize = 30;
  if (props.type === "week") {
    icon = <BsCalendar4Week size={iconSize} />;
    header = Header("Cette semaine");
    activity = Activity("week");
  } else {
    icon = <LuTrendingUp size={iconSize} />;
    header = Header("Ce mois-ci");
    activity = Activity("month");
  }
  return (
    <div className="flex items-center border border-gray-400 rounded-2xl bg-white w-auto p-4">
      <span className="text-bleu-canard-hover bg-blue-900/10 w-auto rounded-2xl p-4">
        {icon}
      </span>
      <div className="flex-col p-4 gap-y-2">
        <span className="flex-1 p-2">
          {header}
          {activity}
        </span>
      </div>
    </div>
  );
}

function Header(header: string) {
  return <h2 className="font-light text-gray-500 text-xl">{header}</h2>;
}

function Activity(activity: string) {
  const { historyTrainings } = useTrainings();

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

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

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

  // Count activities in current week/month
  const { countWeek, countMonth } = useMemo(() => {
    let cw = 0;
    let cm = 0;
    trainingsWithMeta.forEach((t) => {
      t.parsedHistory.forEach((d) => {
        if (d >= startOfWeek && d < endOfWeek) cw++;
        if (d >= startOfMonth && d < endOfMonth) cm++;
      });
    });
    return { countWeek: cw, countMonth: cm };
  }, [trainingsWithMeta, startOfWeek, endOfWeek, startOfMonth, endOfMonth]);

  // Pick what to render depending on activity prop
  const total = activity === "week" ? countWeek : countMonth;

  return (
    <div>
      <p className="font-bold text-black text-2xl">
        {total} activité{total > 1 ? "s" : ""}
      </p>
      {/* <ul className="mt-2 text-sm text-gray-600">
        {trainingsWithMeta.slice(0, 5).map((t) => (
          <li key={t.training.id} className="flex justify-between">
            <span>{t.training.name}</span>
            <span className="text-gray-400">{dateFmt.format(t.lastActivity as Date)}</span>
          </li>
        ))}
        {trainingsWithMeta.length === 0 && (
          <li className="text-gray-400">Aucune activité enregistrée</li>
        )}
      </ul> */}
    </div>
  );
}
