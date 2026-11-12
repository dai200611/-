/* ============================================================
   高校辩论赛计时器 · Service Worker
   作用：首次加载后缓存全部资源，之后完全离线可用
   ============================================================ */
const CACHE_NAME = "debate-timer-cache-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

/* 安装：把所有资源塞进缓存 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())   // 某个资源失败也不阻塞安装
  );
});

/* 激活：清掉旧版本缓存 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* 请求拦截：缓存优先，网络兜底 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // 只缓存同源、成功的响应
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          // 离线且未缓存：如果是导航请求，回到主页面
          if (req.mode === "navigate") return caches.match("./index.html");
          return new Response("", { status: 503, statusText: "Offline" });
        });
    })
  );
});
