"use client";

import { useEffect, useState } from "react";

export const NotificationDebug: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("scheduled-notifications") || "[]"
    );
    setNotifications(stored);

    const interval = setInterval(() => {
      const updated = JSON.parse(
        localStorage.getItem("scheduled-notifications") || "[]"
      );
      setNotifications(updated);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg max-w-sm">
      <h3 className="font-bold">🔔 Notifications planifiées</h3>
      {notifications.length === 0 ? (
        <p>Aucune notification</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className="text-sm mt-2">
            <div>{notif.title}</div>
            <div className="text-gray-400">
              {new Date(notif.timestamp).toLocaleString("fr-FR")}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
