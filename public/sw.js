/* Alperen Aygın Yönetim — service worker.
 *
 * Purpose: make the panel installable and fast to open. It ONLY caches
 * immutable, content-hashed static assets (Next build output, icons, fonts).
 *
 * SAFETY: it deliberately never caches HTML documents, `/api/*`, Supabase, or
 * any data request — those always go straight to the network, so the CRM and
 * all live panel data stay fresh (no stale-data risk). No offline data layer.
 */
const CACHE = "aa-static-v1";

// Only these immutable, hashed paths are cacheable.
const STATIC_RE = /\/_next\/static\/|\/icons\/|\/_next\/media\//;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Never touch cross-origin (e.g. Supabase Storage/API) — let it hit network.
  if (url.origin !== self.location.origin) return;
  // Documents, /api, RSC/data → straight to network, never cached (fresh data).
  if (!STATIC_RE.test(url.pathname)) return;

  // Stale-while-revalidate for immutable static assets.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      if (cached) {
        event.waitUntil(
          fetch(req)
            .then((res) => {
              if (res && res.ok) cache.put(req, res.clone());
            })
            .catch(() => {})
        );
        return cached;
      }
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })()
  );
});
