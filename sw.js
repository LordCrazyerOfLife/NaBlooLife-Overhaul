// Service worker for the installed app. Network first, so updates show up straight away.
// Files you have already loaded are kept as a fallback for when the network is unavailable.
// This is not a full offline download.
const PREFIX = `nabloo-app:${self.registration.scope}:`;
const CACHE = `${PREFIX}v1`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n.startsWith(PREFIX) && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range") || !req.url.startsWith(self.registration.scope)) return;
  e.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res.status === 200) {
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}));
        }
        return res;
      } catch (err) {
        const saved = await caches.match(req, { cacheName: CACHE }).catch(() => undefined);
        if (saved) return saved;
        throw err;
      }
    })(),
  );
});
