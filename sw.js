// sw.js

const cacheName = "smartbook-cache-v1";
const assets = [
    '/',
    '/index.html',
    '/quiz.html',
    '/style.css',
    '/homepage.style.css',
    '/manifest.json',
    '/subjects.json',
    '/class9.json',
    '/dishageography.json',
    '/rajasthan_history.json',
    '/current.json',
    '/yuth_history_pyq.json',
    '/psychology.json',
    '/lib_unit1.json',
    '/lib_unit2.json',
    '/lib_unit3.json',
    '/lib_unit4.json',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png',
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);

    // For JSON files, use a network-first strategy.
    if (requestUrl.pathname.endsWith('.json')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // If the fetch is successful, clone the response and cache it.
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(cacheName).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // If the network fails, try to get it from the cache.
                    return caches.match(event.request);
                })
        );
    } else {
        // For other files, use a cache-first strategy.
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    const responseToCache = fetchResponse.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return fetchResponse;
                });
            })
        );
    }
});
