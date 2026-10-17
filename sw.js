const CACHE = "prep-v12";
const ASSETS = ["./", "./index.html", "./data.js", "./data2.js", "./qcm.js", "./lang.js", "./fr.js", "./en.js", "./bodies-fr.js", "./bodies-en.js", "./bodies-m1-ar.js", "./bodies-m1-fr.js", "./bodies-m1-en.js", "./asst-lang.js", "./assistant.js", "./app.js", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isNav = e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  const isCode = /\.(js|css|json|webmanifest)$/.test(url.pathname);

  if (isNav || isCode) {
    // شبكة أولاً: باش التحديثات توصل دغيا، والكاش غير للوضع offline
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
