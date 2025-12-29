
const CACHE_NAME = 'haoxiangsheng-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/metadata.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 绕过所有缓存，优先获取网络资源，解决发布后无法即时更新的问题
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
