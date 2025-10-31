"use client";

import { Exercise, Training, ScheduledTraining } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  scheduledTrainings: ScheduledTraining[];
}

export default function CalendarTrainingTest() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [scheduledTrainings, setScheduledTrainings] = useState<
    ScheduledTraining[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<string>("");
  const [notificationTime, setNotificationTime] = useState("09:00");
  const [enableNotification, setEnableNotification] = useState(false);
  const router = useRouter();

  // Charger les données depuis le localStorage
  useEffect(() => {
    const storedTrainings = localStorage.getItem("trainings");
    const storedScheduled = localStorage.getItem("scheduledTrainings");

    if (storedTrainings) setTrainings(JSON.parse(storedTrainings));
    if (storedScheduled) setScheduledTrainings(JSON.parse(storedScheduled));
  }, []);

  // Sauvegarder les entraînements planifiés
  useEffect(() => {
    localStorage.setItem(
      "scheduledTrainings",
      JSON.stringify(scheduledTrainings)
    );
  }, [scheduledTrainings]);

  // Générer le calendrier
  const generateCalendar = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const calendar: CalendarDay[] = [];
    const iterationDate = new Date(startDate);

    while (iterationDate <= endDate) {
      const dateKey = iterationDate.toISOString().split("T")[0];
      const dayTrainings = scheduledTrainings.filter(
        (st) => st.date === dateKey
      );

      calendar.push({
        date: new Date(iterationDate),
        isCurrentMonth: iterationDate.getMonth() === month,
        isToday: iterationDate.toDateString() === new Date().toDateString(),
        scheduledTrainings: dayTrainings,
      });

      iterationDate.setDate(iterationDate.getDate() + 1);
    }

    return calendar;
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const scheduleTraining = () => {
    if (!selectedDate || !selectedTraining) return;

    const training = trainings.find((t) => t.id === selectedTraining);
    if (!training) return;

    const dateKey = selectedDate.toISOString().split("T")[0];
    const newScheduledTraining: ScheduledTraining = {
      id: crypto.randomUUID(),
      trainingId: selectedTraining,
      trainingName: training.name,
      date: dateKey,
      notification: enableNotification,
      notificationTime: enableNotification ? notificationTime : undefined,
      emoji: training.emoji || "🏋",
    };

    const updatedScheduled = [...scheduledTrainings, newScheduledTraining];
    setScheduledTrainings(updatedScheduled);

    // Planifier la notification si activée
    if (enableNotification) {
      scheduleNotification(newScheduledTraining);
    }

    setShowScheduleModal(false);
    setSelectedTraining("");
    setEnableNotification(false);
    setNotificationTime("09:00");
  };

  const scheduleNotification = (scheduledTraining: ScheduledTraining) => {
    if (!("Notification" in window)) {
      alert("Les notifications ne sont pas supportées par ce navigateur");
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          createNotification(scheduledTraining);
        }
      });
    } else if (Notification.permission === "granted") {
      createNotification(scheduledTraining);
    }
  };

  const createNotification = (scheduledTraining: ScheduledTraining) => {
    const trainingDate = new Date(scheduledTraining.date);
    const [hours, minutes] = scheduledTraining.notificationTime
      ?.split(":")
      .map(Number) || [9, 0];

    trainingDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeDiff = trainingDate.getTime() - now.getTime();

    if (timeDiff > 0) {
      setTimeout(() => {
        new Notification("🎯 Entraînement programmé", {
          body: `N'oubliez pas votre séance : ${scheduledTraining.trainingName}`,
          icon: "/favicon.ico",
          tag: scheduledTraining.id,
        });
      }, timeDiff);
    }
  };

  const removeScheduledTraining = (
    trainingId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setScheduledTrainings(
      scheduledTrainings.filter((st) => st.id !== trainingId)
    );
  };

  const getDaysOfWeek = () => {
    return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  };

  const calendar = generateCalendar();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg text-2xl transition-colors"
        >
          ‹
        </button>

        <h2 className="text-2xl font-bold text-gray-800">
          {currentDate.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-200 rounded-lg text-2xl transition-colors"
        >
          ›
        </button>
      </div>

      {/* Grille du calendrier */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 bg-gray-100 border-b">
          {getDaysOfWeek().map((day) => (
            <div
              key={day}
              className="p-3 text-center font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Jours du mois */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendar.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                min-h-32 p-2 bg-white cursor-pointer transition-all hover:bg-gray-50
                ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                ${day.isToday ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`
                  text-sm font-medium
                  ${
                    day.isToday
                      ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : ""
                  }
                `}
                >
                  {day.date.getDate()}
                </span>
                {day.scheduledTrainings.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                    {day.scheduledTrainings.length}
                  </span>
                )}
              </div>

              {/* Entraînements programmés */}
              <div className="space-y-1">
                {day.scheduledTrainings.map((training) => (
                  <div
                    key={training.id}
                    className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded p-1 text-xs group"
                  >
                    <div className="flex items-center space-x-1 truncate">
                      <span>{training.emoji}</span>
                      <span className="truncate">{training.trainingName}</span>
                    </div>
                    <button
                      onClick={(e) => removeScheduledTraining(training.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de planification */}
      {showScheduleModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Planifier un entraînement pour le{" "}
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisir un entraînement
                </label>
                <select
                  value={selectedTraining}
                  onChange={(e) => setSelectedTraining(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Sélectionnez un entraînement</option>
                  {trainings.map((training) => (
                    <option key={training.id} value={training.id}>
                      {training.emoji} {training.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enableNotification}
                    onChange={(e) => setEnableNotification(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Activer la notification
                  </span>
                </label>

                {enableNotification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de notification
                    </label>
                    <input
                      type="time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={scheduleTraining}
                  disabled={!selectedTraining}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Planifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Légende :</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Aujourd'hui</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Entraînement programmé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
