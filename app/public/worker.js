self.addEventListener('install', function (event) {
    ('install2', event);
});
self.addEventListener('activate', function (event) {
    ('activate2', event);
    self.registration.showNotification("ativando!!", { body: 'haha' })
});
self.addEventListener('fetch', function (event) {
    ('fetch2', event);
});
self.addEventListener('message', function (event) {
    ('message2', event);

    event.ports[0].postMessage({ 'test': 'This is my response.' });
});
self.addEventListener('push', function (event) {
    ('push2', event.data);
    self.registration.showNotification("push message!!", { body: 'hihi' + event.data })
});
self.addEventListener('sync', function (event) {
    ('sync2', event);
});
self.addEventListener('notificationclick', function (event) {
    ('notificationclick2', event);
});