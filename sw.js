// 竞彩门店通 - Service Worker
const CACHE_NAME = 'ticaidian-v1';
const urlsToCache = [
  '/ticaidian/',
  '/ticaidian/index.html',
  '/ticaidian/pages/dlt.html',
  '/ticaidian/pages/pls.html',
  '/ticaidian/pages/plw.html',
  '/ticaidian/pages/jczq.html',
  '/ticaidian/pages/jclq.html',
  '/ticaidian/pages/fangan.html',
  '/ticaidian/pages/profile.html',
  '/ticaidian/pages/qiandao.html',
  '/ticaidian/pages/kaijiang.html',
  '/ticaidian/pages/zoushi.html',
  '/ticaidian/pages/calculator.html',
  '/ticaidian/manifest.json',
  '/ticaidian/icons/icon-192x192.png',
  '/ticaidian/icons/icon-512x512.png'
];

// 安装时缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log('Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存命中，直接返回
        if (response) {
          return response;
        }
        // 缓存未命中，发起网络请求
        return fetch(event.request)
          .then((networkResponse) => {
            // 只缓存GET请求且状态为200的响应
            if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
              return networkResponse;
            }
            // 克隆响应（响应流只能读取一次）
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            // 网络请求失败，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/ticaidian/index.html');
            }
          });
      })
  );
});

// 后台同步（用于离线签到等操作）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-qiandao') {
    event.waitUntil(syncQiandaoData());
  }
});

async function syncQiandaoData() {
  // 同步离线签到数据
  console.log('Syncing qiandao data...');
}