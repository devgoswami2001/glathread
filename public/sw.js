self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    // Use the provided image as the main icon, with a fallback
    icon: data.image || '/logo.svg', 
    badge: '/logo.svg', // A badge for the notification bar
    // The main image for the notification
    image: data.image,
    data: {
      url: data.url, // URL to open on click
    },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;
  if (urlToOpen) {
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});

