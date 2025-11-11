"use client";

import { useTrainings } from "@/hooks/useTrainings";
import { ScheduledTraining } from "@/lib/interfaces";
import { useState } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { Field, Label, Select } from "@headlessui/react";
import { NotificationManager } from "./NotificationManager";
import { NotificationDebug } from "./NotificationDebug";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isCurrentDay: boolean;
  scheduledTrainings: ScheduledTraining[];
}

export default function CalendarTraining() {
  const {
    trainings,
    scheduledTrainings,
    isLoading,
    addScheduledTraining,
    deleteScheduledTraining,
    updateScheduledTraining,
  } = useTrainings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string>("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState("17:00");

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const generateCalendar = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Pour avoir le premier jour de la première semaine et dernier jour, compléter les semaines
    // Ajuster pour commencer la semaine par lundi (1) au lieu de dimanche (0)
    const startDate = new Date(firstDay);
    const firstDayOfWeek = firstDay.getDay(); // 0=dimanche, 1=lundi, etc.

    // Calcul du décalage pour commencer par lundi
    // Si premier jour = dimanche (0), on recule de 6 jours pour avoir le lundi précédent
    // Sinon on recule de (jourDeLaSemaine - 1) jours
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    startDate.setDate(startDate.getDate() - startOffset);

    // Ajuster pour finir par dimanche
    const endDate = new Date(lastDay);
    const lastDayOfWeek = lastDay.getDay(); // 0=dimanche, 1=lundi, etc.

    // Calcul du décalage pour finir par dimanche
    // Si dernier jour = dimanche (0), pas besoin d'ajouter de jours
    // Sinon on ajoute (6 - jourDeLaSemaine) + 1 jours pour atteindre le dimanche suivant
    const endOffset = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    endDate.setDate(endDate.getDate() + endOffset);

    const calendar: CalendarDay[] = [];
    const iterationDate = new Date(startDate);
    while (iterationDate <= endDate) {
      // Création d'une clé de date au format YYYY-MM-DD
      const year = iterationDate.getFullYear();
      const month = String(iterationDate.getMonth() + 1).padStart(2, "0");
      const day = String(iterationDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;
      // Filtrage des entraînements pour ce jour
      const dayTrainings = scheduledTrainings.filter(
        (st) => st.date === dateKey
      );

      // Ajout du jour au calendrier
      calendar.push({
        date: new Date(iterationDate),
        isCurrentMonth: iterationDate.getMonth() === currentDate.getMonth(),
        isCurrentDay:
          iterationDate.toDateString() === new Date().toDateString(),
        scheduledTrainings: dayTrainings,
      });

      iterationDate.setDate(iterationDate.getDate() + 1);
    }

    return calendar;
  };

  const calendar = generateCalendar();

  const handleClickMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setModal(true);
  };

  const handleCancelButton = () => {
    setModal(false);
    setSelectedTraining("");
    setEnableNotification(false);
    setNotificationTime("17:00");
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTraining) return;
    const training = trainings.find((t) => t.id === selectedTraining);
    if (!training) {
      alert("Error training not found");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    const newScheduledTraining: ScheduledTraining = {
      id: crypto.randomUUID(),
      trainingId: selectedTraining,
      trainingName: training.name,
      date: dateKey,
      notification: enableNotification,
      notificationTime: enableNotification ? notificationTime : undefined,
      emoji: training.emoji,
    };

    addScheduledTraining(newScheduledTraining);
    if (enableNotification) {
      scheduleTrainingNotification(newScheduledTraining);
    }

    handleCancelButton();
  };

  // Ajouter cette fonction dans votre composant
  const scheduleTrainingNotification = (training: ScheduledTraining) => {
    if (!selectedDate || !enableNotification) return;

    const [hours, minutes] = notificationTime.split(":").map(Number);

    // Utiliser la date exacte sélectionnée
    const trainingDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes
    );

    const notificationData = {
      id: training.trainingId, // ou utiliser l'ID de l'entraînement planifié
      title: `🎯 ${training.trainingName}`,
      body: `Votre entraînement "${training.trainingName}" est prévu aujourd'hui`,
      timestamp: trainingDateTime.getTime(),
      date: training.date,
      trainingId: training.id,
    };

    // Envoyer au Service Worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SCHEDULE_NOTIFICATION",
        notification: notificationData,
      });
    } else {
      console.error("Service Worker non disponible");
    }

    console.log("🔔 Notification planifiée:", {
      pour: new Date(trainingDateTime).toLocaleString("fr-FR"),
      // dans: Math.round((trainingDateTime - Date.now()) / 60000) + " minutes",
      training: training.trainingName,
    });

    // Stocker pour persistance
    storeNotificationInStorage(notificationData);
  };

  const storeNotificationInStorage = (notification: any) => {
    const existingNotifications = JSON.parse(
      localStorage.getItem("scheduled-notifications") || "[]"
    );

    const filteredNotifications = existingNotifications.filter(
      (n: any) => n.id !== notification.id
    );

    localStorage.setItem(
      "scheduled-notifications",
      JSON.stringify([...filteredNotifications, notification])
    );
  };

  const handleDeleteScheduled = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Trouver l'entraînement pour récupérer les infos de notification
    const trainingToDelete = scheduledTrainings.find((st) => st.id === id);

    deleteScheduledTraining(id);

    // Supprimer aussi la notification planifiée
    if (trainingToDelete?.notification && trainingToDelete.notificationTime) {
      cancelScheduledNotification(trainingToDelete.id);
    }
  };

  const cancelScheduledNotification = (trainingId: string) => {
    // Nettoyer le localStorage
    const existingNotifications = JSON.parse(
      localStorage.getItem("scheduled-notifications") || "[]"
    );

    const filteredNotifications = existingNotifications.filter(
      (n: any) => n.trainingId !== trainingId
    );

    localStorage.setItem(
      "scheduled-notifications",
      JSON.stringify(filteredNotifications)
    );

    // Informer le Service Worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CANCEL_NOTIFICATION",
        trainingId: trainingId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement des entraînements du calendrier...</p>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <NotificationManager />
      <NotificationDebug />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="rounded-lg cursor-pointer text-bleu-canard hover:bg-gray-200 hover:text-gray-800 text-2xl transition-all p-3"
          onClick={() => handleClickMonth(-1)}
        >
          <IoIosArrowDropleft size={30} />
        </button>

        <h2 className="text-2xl font-bold text-gray-700">
          {currentDate.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          className="rounded-lg cursor-pointer text-bleu-canard hover:bg-gray-200 hover:text-gray-800 text-2xl transition-all p-3"
          onClick={() => handleClickMonth(1)}
        >
          <IoIosArrowDropright size={30} />
        </button>
      </div>

      {/* Days of calendar */}
      <div className="bg-white rounded-lg shadow-xl">
        <div className="grid grid-cols-7 border-b bg-gray-100">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-3 text-xl text-center text-gray-700 font-semibold"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-1 gap-1">
          {calendar.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`hover:bg-bleu-canard hover:text-blanc-casse transition-all cursor-pointer min-h-32 p-2
                ${day.isCurrentMonth ? "bg-gray-50" : "bg-gray-200"} 
                ${day.isCurrentDay ? "ring-2 ring-bleu-canard" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-lg font-medium
                         ${
                           day.isCurrentDay
                             ? "bg-blue-400 text-white p-4 rounded-full w-6 h-6 flex items-center justify-center"
                             : ""
                         }`}
                >
                  {day.date.getDate()}
                </span>

                {day.scheduledTrainings.length > 0 && (
                  <span className="text-md bg-rose-poudre-hover font-semibold px-2 rounded-lg text-gray-800">
                    {day.scheduledTrainings.length}
                  </span>
                )}
              </div>

              {/* Scheduled trainings */}
              {day.scheduledTrainings.map((t) => (
                <div
                  key={t.id}
                  className="flex item-center justify-between pb-1 bg-rose-poudre hover:bg-rose-poudre-hover rounded p-1 text-md transition-all"
                >
                  <div className="flex items-center space-x-1 truncate text-xs text-gray-900">
                    <span>{t.emoji}</span>
                    <span className="truncate">{t.trainingName}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteScheduled(t.id, e)}
                    className="text-black hover:text-blanc-casse cursor-pointer text-xl"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && selectedDate && (
        <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-3 z-50">
          <div className="rounded-lg bg-white w-full p-6 max-w-lg mx-auto my-auto shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">
              Planifier un entraînement pour le{" "}
              {selectedDate.toLocaleDateString()}
            </h1>

            <Field className="mt-6 flex-col">
              <Label className="flex text-2xl font-medium p-3">
                Choisir un entraînement
              </Label>
              <Select
                name="training"
                aria-label="entraînement"
                className="w-full rounded-lg p-2 border data-focus:bg-blue-100 data-hover:shadow cursor-pointer"
                value={selectedTraining}
                onChange={(e) => setSelectedTraining(e.target.value)}
              >
                {trainings.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.emoji} {t.name}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="flex p-3 mt-5 items-center space-x-2">
              <input
                type="checkbox"
                checked={enableNotification}
                onChange={(e) => setEnableNotification(e.target.checked)}
                className="rounded size-5 cursor-pointer border-gray-200 hover:shadow-md"
              />
              <span className="text-2xl font-medium p-2">
                Planifier une notification
              </span>
            </div>

            {enableNotification && (
              <div className="flex space-x-2">
                <span className="flex-1 text-xl">Heure de notification</span>
                <input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="flex-2 rounded border border-gray-300"
                />
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancelButton}
                className="flex-1 rounded-xl cursor-pointer p-4 border border-gray-300 hover:bg-gray-100 bg-gray-50 text-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedTraining}
                className="flex-1 rounded-xl cursor-pointer bg-bleu-canard hover:bg-bleu-canard-hover text-blanc-casse text-xl font-semibold disabled:bg-gray-500"
              >
                Planifier!!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
