const CACHE_NAME = 'torn-rental-v1';
// Auto-detect base path — works on Vercel, GitHub Pages, or local
const BASE = self.location.pathname.replace(/\/sw\.js$/, '') || '';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
];

// Install - cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});

// Background sync check - fires when browser allows it
self.addEventListener('periodicsync', e => {
  if (e.tag === 'rental-check') {
    e.waitUntil(checkRentalExpiry());
  }
});

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  self.registration.showNotification(data.title || 'Torn Rental Alert', {
    body: data.body || 'Check your rental status.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'rental',
    renotify: true,
    data: { url: '/' }
  });
});

// Notification click - focus or open app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});

// Check rentals from localStorage and fire notifications
async function checkRentalExpiry() {
  const allClients = await clients.matchAll({ includeUncontrolled: true });
  if (allClients.length > 0) return; // App is open, let it handle

  // Read data via message to clients or stored data
  const cache = await caches.open(CACHE_NAME);
  const stored = await cache.match('/rental-data');
  if (!stored) return;

  const data = await stored.json();
  const rentals = data.rentals || [];
  const notified = data.notified || {};
  const now = Date.now();

  const THRESHOLDS = [
    { key: '24h', ms: 24 * 3600000, label: '24 hours' },
    { key: '12h', ms: 12 * 3600000, label: '12 hours' },
    { key: '1h',  ms:  1 * 3600000, label: '1 hour'   },
    { key: 'exp', ms: 0,            label: 'NOW'       },
  ];

  for (const r of rentals) {
    const expiry = new Date(r.expiryDate).getTime();
    const remaining = expiry - now;
    if (!notified[r.id]) notified[r.id] = {};

    for (const t of THRESHOLDS) {
      if (notified[r.id][t.key]) continue;
      const shouldAlert = t.ms === 0
        ? remaining <= 0
        : remaining <= t.ms && remaining > t.ms - 3600000;

      if (shouldAlert) {
        notified[r.id][t.key] = true;
        const title = t.ms === 0
          ? `⚠️ EXPIRED: ${r.property}`
          : `🔔 ${r.property} expires in ${t.label}`;
        const body = t.ms === 0
          ? `Your rental has expired! Renew immediately.`
          : `Rental expiry: ${new Date(expiry).toUTCString().slice(0,25)} TCT`;

        await self.registration.showNotification(title, {
          body, icon: '/icon-192.png', badge: '/icon-192.png',
          vibrate: [300, 100, 300], tag: `${r.id}-${t.key}`,
          renotify: true
        });
      }
    }
  }

  // Save updated notified state
  await cache.put('/rental-data', new Response(JSON.stringify({ rentals, notified })));
}

// Listen for data updates from the main app
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'STORE_RENTALS') {
    caches.open(CACHE_NAME).then(cache => {
      cache.put('/rental-data', new Response(JSON.stringify(e.data.payload)));
    });
  }
});
