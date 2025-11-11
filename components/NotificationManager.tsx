// components/NotificationManager.tsx
import { useEffect, useRef } from "react";

interface NotificationData {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  date: string;
  time: string;
  trainingId: string;
}

export const NotificationManager: React.FC = () => {
  const notificationCheckRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    initializeNotifications();

    return () => {
      if (notificationCheckRef.current) {
        clearInterval(notificationCheckRef.current);
      }
    };
  }, []);

  const initializeNotifications = async () => {
    // Vérifier la compatibilité navigateur
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      console.warn("Notifications non supportées");
      return;
    }

    try {
      // Demander la permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("✅ Permission notifications accordée");

        // Enregistrer le Service Worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("✅ Service Worker enregistré");

        // Attendre qu'il soit actif
        await waitForServiceWorkerActive(registration);

        // Planifier les notifications existantes
        scheduleAllNotifications();

        // Vérification de secours côté client
        notificationCheckRef.current = setInterval(() => {
          checkAndScheduleNotifications();
        }, 45000); // 45 secondes
      }
    } catch (error) {
      console.error("❌ Erreur initialisation:", error);
    }
  };

  const waitForServiceWorkerActive = (
    registration: ServiceWorkerRegistration
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (registration.active) {
        resolve();
      } else {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                resolve();
              }
            });
          }
        });
      }
    });
  };

  const scheduleAllNotifications = () => {
    const scheduledTrainings = getScheduledTrainingsFromStorage();
    console.log(`📋 ${scheduledTrainings.length} entraînements à planifier`);

    scheduledTrainings.forEach((training) => {
      if (training.notification && training.notificationTime) {
        scheduleTrainingNotification(
          {
            id: training.id,
            name: training.trainingName,
            emoji: training.emoji,
          },
          training.date,
          training.notificationTime
        );
      }
    });
  };

  const checkAndScheduleNotifications = () => {
    const scheduledTrainings = getScheduledTrainingsFromStorage();
    const now = Date.now();

    scheduledTrainings.forEach((training) => {
      if (training.notification && training.notificationTime) {
        const notificationTime = calculateNotificationTime(
          training.date,
          training.notificationTime
        );

        // Planifier si dans les 24h suivantes et pas déjà passée
        if (
          notificationTime > now &&
          notificationTime < now + 24 * 60 * 60 * 1000
        ) {
          scheduleTrainingNotification(
            {
              id: training.id,
              name: training.trainingName,
              emoji: training.emoji,
            },
            training.date,
            training.notificationTime
          );
        }
      }
    });
  };

  const calculateNotificationTime = (date: string, time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    const notificationDate = new Date(date);
    notificationDate.setHours(hours, minutes, 0, 0);
    return notificationDate.getTime();
  };

  const scheduleTrainingNotification = (
    training: any,
    date: string,
    time: string
  ) => {
    const notificationTime = calculateNotificationTime(date, time);

    const notificationData: NotificationData = {
      id: `training-${training.id}-${date}-${time}`,
      title: `🎯 ${training.name}`,
      body: `Votre entraînement "${training.name}" est prévu maintenant`,
      timestamp: notificationTime,
      date: date,
      time: time,
      trainingId: training.id,
    };

    console.log("🔔 Envoi au Service Worker:", {
      training: training.name,
      time: new Date(notificationTime).toLocaleString("fr-FR"),
    });

    // Envoyer au Service Worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SCHEDULE_NOTIFICATION",
        notification: notificationData,
      });
    } else {
      console.warn("Service Worker controller non disponible");
    }
  };

  const getScheduledTrainingsFromStorage = (): any[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("scheduled-trainings") || "[]");
    } catch {
      return [];
    }
  };

  return null;
};
