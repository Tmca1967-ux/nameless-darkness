/* SU Connect — Service Worker
   Permite instalar a app e funcionar offline.
   IMPORTANTE: ao publicar uma nova versão da app, incrementar CACHE (v1 -> v2…)
   para forçar a atualização dos ficheiros em cache. */
const CACHE = "su-connect-v4";
const SHELL = [
  "./",
  "./manifest.webmanifest",
  "./config.js",
  "./supabase.js",
  "./logo.jpg",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Pedidos a outros domínios (ex.: Supabase, CDN) — sempre rede, sem interferência.
  if (url.origin !== self.location.origin) return;

  // Navegação / HTML: rede primeiro (para apanhar atualizações), cache como recurso.
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then((m) => m || caches.match("./")))
    );
    return;
  }

  // Estáticos e PDF: serve da cache e atualiza em segundo plano (stale-while-revalidate).
  // Os PDF abertos ficam disponíveis offline depois da 1ª abertura.
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req)
        .then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; })
        .catch(() => cached);
      return cached || net;
    })
  );
});
