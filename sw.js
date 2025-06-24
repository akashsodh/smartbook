// sw.js - संस्करण 4

// --- STEP 1: कैश का नाम और संस्करण ---
// हर बार जब आप इस फ़ाइल में बदलाव करें, तो संस्करण संख्या बढ़ाएँ (जैसे, v3 से v4)
const cacheName = "smartbook-cache-v22";

// --- STEP 2: कैश की जाने वाली फाइलें ---
// यह वह जगह है जहाँ assetsToCache वैरिएबल को परिभाषित किया गया है।
// सुनिश्चित करें कि यह सूची आपके प्रोजेक्ट की सभी महत्वपूर्ण फाइलों को शामिल करती है।
const assetsToCache = [
    "/",
    "/index.html",
    "/quiz.html",
    "/style.css",
    "/homepage.style.css",
    "/manifest.json",
    "/sw.js",
    "/subjects.json", // यह महत्वपूर्ण फ़ाइल है
    "/rajasthan_history.json",
    "/psychology.json",
    "/yuth_history_pyq.json",
    "/dishageography.json",
    "/current.json",
    "/class9.json",
    "/lib_unit1.json",
    "/lib_unit2.json",
    "/lib_unit3.json",
    "/lib_unit4.json"
];


// --- STEP 3: सर्विस वर्कर इंस्टॉलेशन ---
self.addEventListener("install", (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('Service Worker: Caching app shell');
            // यहाँ assetsToCache का उपयोग किया जा रहा है
            return cache.addAll(assetsToCache);
        }).catch(err => {
            console.error('Failed to cache assets:', err);
        })
    );
});

// --- STEP 4: पुराने कैश को हटाना ---
self.addEventListener("activate", (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        console.log('Service Worker: Deleting old cache', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// --- STEP 5: नेटवर्क अनुरोधों को संभालना ---
self.addEventListener("fetch", (event) => {
    // हम केवल GET अनुरोधों को संभालते हैं
    if (event.request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(event.request.url);

    if (requestUrl.pathname.endsWith('.json')) {
        // JSON फ़ाइलों के लिए: पहले नेटवर्क, फिर कैश
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(cacheName).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    } else {
        // अन्य फ़ाइलों के लिए: पहले कैश, फिर नेटवर्क
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    if(fetchResponse.ok) {
                        const responseToCache = fetchResponse.clone();
                        caches.open(cacheName).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return fetchResponse;
                });
            })
        );
    }
});

// --- STEP 6: ऐप से संदेश सुनना ---
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Service Worker: Skip waiting message received.');
        self.skipWaiting();
    }
});
