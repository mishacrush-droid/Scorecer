const CACHE_NAME = 'scorecer-pwa-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/hero-goalnet.jpg',
  '/images/wet-turf.jpg',
  '/images/squads-pub.jpg',
  '/images/tactical-pitch.jpg',
  '/images/highlight-goal.jpg',
  '/images/highlight-save.jpg',
  '/images/ceo-aleksandra.jpg',
  '/images/cto-max.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((oldKey) => caches.delete(oldKey))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Network-first for ESPN live API requests, Cache-first with network fallback for static assets
  if (req.url.includes('site.api.espn.com')) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (
            res &&
            res.status === 200 &&
            res.type === 'basic' &&
            (req.url.endsWith('.jpg') ||
              req.url.endsWith('.css') ||
              req.url.endsWith('.js'))
          ) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (data && data.type === 'SCORECER_SHOW_NOTIFICATION') {
    const { title, body, tag } = data.payload || {};
    if (self.registration && self.registration.showNotification) {
      self.registration.showNotification(title || 'Scorecer Live Alert', {
        body: body || 'Match update received',
        icon: '/images/hero-goalnet.jpg',
        badge: '/images/tactical-pitch.jpg',
        tag: tag || 'scorecer-match-alert',
        renotify: true,
      });
    }
  }
});
