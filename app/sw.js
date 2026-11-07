/* ==========================================================================
   CLIMATE READY NICHADA — offline support ("service worker")
   --------------------------------------------------------------------------
   This file lets the app open with no internet, e.g. during a flood or a
   power cut. The first time someone opens the app online, their phone saves
   a copy of it. After that:
   • Online:  the app loads normally and the saved copy is refreshed, so
              updates you upload reach people automatically.
   • Offline: the saved copy opens instead. Everything works except the
              live readings, which need internet.
   You don't need to edit this file. Upload it with the other files.
   ========================================================================== */

const CACHE = 'climate-ready-nichada-v3';

// The app's own files, saved on first visit.
const APP_FILES = ['./', 'index.html', 'logo.jpg', 'icon.png', 'icon-192.png', 'icon-maskable.png', 'manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  // Remove copies saved by older versions of this file.
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameSite = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  // Live readings (Open-Meteo, the Worker) and other sites: always go to the internet.
  if (!sameSite && !isFont) return;

  // Pages: try the internet first so updates show up; use the saved copy if offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => { save(req, res.clone()); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // Pictures, icons and fonts: use the saved copy straight away, refresh it in the background.
  event.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => { save(req, res.clone()); return res; }).catch(() => cached);
      return cached || fresh;
    })
  );
});

function save(req, res) {
  if (res && (res.ok || res.type === 'opaque')) caches.open(CACHE).then(c => c.put(req, res));
}
