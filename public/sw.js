const CACHE_NAME = 'notifications-v1';
const NOTIFICATION_DB = 'NotificationDB';
const STORE_NAME = 'notifications';

// Installation simple et robuste
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installé');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker activé');
  event.waitUntil(self.clients.claim());
  // Restaurer les notifications au démarrage
  event.waitUntil(restoreAllNotifications());
});

// Gestion des messages
self.addEventListener('message', (event) => {
  const { type, notification, trainingId } = event.data;
  
  switch (type) {
    case 'SCHEDULE_NOTIFICATION':
      scheduleNotification(notification);
      break;
    case 'CANCEL_NOTIFICATION':
      cancelNotification(trainingId);
      break;
    case 'CLEAR_ALL_NOTIFICATIONS':
      clearAllNotifications();
      break;
  }
});

// Planification robuste avec fallbacks
async function scheduleNotification(notificationData) {
  const { id, title, body, timestamp } = notificationData;
  const now = Date.now();
  const delay = timestamp - now;

  console.log('⏰ Planification:', { title, delay: Math.round(delay/1000) + 's' });

  // Validation
  if (delay <= 0 || delay > 7 * 24 * 60 * 60 * 1000) { // Max 7 jours
    console.warn('Délai invalide');
    return;
  }

  try {
    // Méthode 1: Stockage persistant + vérification périodique (universel)
    await saveNotificationToDB(notificationData);
    
    // Méthode 2: setTimeout (pour navigateurs qui le gardent)
    if (delay < 24 * 60 * 60 * 1000) { // Seulement pour < 24h
      const timeoutId = setTimeout(() => {
        triggerNotification(notificationData);
      }, delay);
      
      // Stocker pour annulation possible
      if (!self.activeTimeouts) self.activeTimeouts = new Map();
      self.activeTimeouts.set(id, timeoutId);
    }
    
  } catch (error) {
    console.error('Erreur planification:', error);
  }
}

// Déclenchement de notification
async function triggerNotification(notificationData) {
  const { id, title, body } = notificationData;
  
  try {
    await self.registration.showNotification(title, {
      body: body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: id,
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200]
    });
    
    console.log('✅ Notification affichée:', title);
    await deleteNotificationFromDB(id);
    
    // Nettoyer le timeout
    if (self.activeTimeouts && self.activeTimeouts.has(id)) {
      clearTimeout(self.activeTimeouts.get(id));
      self.activeTimeouts.delete(id);
    }
  } catch (error) {
    console.error('❌ Erreur affichage notification:', error);
  }
}

// Vérification périodique (solution de fallback universelle)
setInterval(async () => {
  try {
    const notifications = await getAllNotificationsFromDB();
    const now = Date.now();
    
    for (const notification of notifications) {
      const timeDiff = notification.timestamp - now;
      
      // Déclencher si dans les 60 secondes suivantes
      if (timeDiff <= 60000 && timeDiff > -30000) { // -30s de marge
        console.log('🔄 Déclenchement périodique:', notification.title);
        await triggerNotification(notification);
      }
      
      // Nettoyer les anciennes (> 1 jour)
      if (timeDiff < -24 * 60 * 60 * 1000) {
        await deleteNotificationFromDB(notification.id);
      }
    }
  } catch (error) {
    console.error('Erreur vérification périodique:', error);
  }
}, 30000); // Vérifier toutes les 30 secondes

// Gestion IndexedDB simplifiée
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(NOTIFICATION_DB, 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveNotificationToDB(notification) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(notification);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getAllNotificationsFromDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function deleteNotificationFromDB(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function restoreAllNotifications() {
  try {
    const notifications = await getAllNotificationsFromDB();
    const now = Date.now();
    
    console.log(`🔄 Restauration de ${notifications.length} notifications`);
    
    for (const notification of notifications) {
      const delay = notification.timestamp - now;
      
      // Replanifier seulement celles dans le futur
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        await scheduleNotification(notification);
      } else if (delay <= 0) {
        // Supprimer les expirées
        await deleteNotificationFromDB(notification.id);
      }
    }
  } catch (error) {
    console.error('Erreur restauration:', error);
  }
}

function cancelNotification(trainingId) {
  // Annuler les timeouts actifs
  if (self.activeTimeouts) {
    for (const [id, timeout] of self.activeTimeouts.entries()) {
      if (id.includes(trainingId)) {
        clearTimeout(timeout);
        self.activeTimeouts.delete(id);
      }
    }
  }
  
  // Supprimer de la base de données
  deleteNotificationFromDB(trainingId).catch(console.error);
}

function clearAllNotifications() {
  if (self.activeTimeouts) {
    for (const timeout of self.activeTimeouts.values()) {
      clearTimeout(timeout);
    }
    self.activeTimeouts.clear();
  }
}

// Gestion du clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Ouvrir ou focus l'application
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});