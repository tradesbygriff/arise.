const CACHE_NAME = "arise-pwa-v1";
const CACHE_PREFIX = "arise-pwa-";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pwa-register.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon.png"
];

const INDEX_URL = new URL("./index.html", self.location).href;
const ROOT_URL = new URL("./", self.location).href;
const SHELL_URLS = new Set(APP_SHELL.map(path => new URL(path, self.location).href));

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
          cache.put(INDEX_URL, response.clone());
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (
          await cache.match(request) ||
          await cache.match(INDEX_URL) ||
          await cache.match(ROOT_URL) ||
          Response.error()
        );
      }
    })());
    return;
  }

  if (!SHELL_URLS.has(url.href)) return;

  const networkUpdate = fetch(request).then(async response => {
    if (response && response.ok && response.type === "basic") {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  });

  event.waitUntil(networkUpdate.catch(() => undefined));
  event.respondWith(
    caches.match(request).then(cached =>
      cached || networkUpdate.catch(() => Response.error())
    )
  );
});
