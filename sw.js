/* Borne vidéo — fonctionnement hors ligne
   Stratégie : on essaie toujours d'abord le réseau (pour récupérer les
   modifications de config.js), et si le réseau ne répond pas en 3 s ou
   n'est pas disponible, on sert la copie enregistrée sur l'iPad.        */

const CACHE = 'borne-video-v3-1';
const FILES = ['./', './index.html', './config.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo-content-camp.png',
  './vendor/pose3d.js', './vendor/face-api.esm.js',
  './models/tiny_face_detector_model-weights_manifest.json', './models/tiny_face_detector_model.bin',
  './models/face_expression_model-weights_manifest.json', './models/face_expression_model.bin'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const net = await Promise.race([
        fetch(req, { cache: 'no-store' }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
      ]);
      if (net && net.ok) cache.put(req, net.clone());
      return net;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const home = await cache.match('./index.html');
        if (home) return home;
      }
      throw err;
    }
  })());
});
