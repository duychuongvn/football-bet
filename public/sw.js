console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('push', function(event, a) {
  console.log('Push message', event);
  var title = 'Le push de test :)';
  event.waitUntil(
    self.registration.showNotification(title, {
     body: 'Bravo tu l\'as reçu',
     icon: 'images/icon.png',
     tag: `tag-${new Date().getTime()}`
   }));
});
