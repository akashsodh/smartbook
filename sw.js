// sw.js

// **महत्वपूर्ण:** जब भी आप कोई टेस्ट सीरीज़ या कोई और फाइल अपडेट करें,
// तो इस संस्करण को बदलें (जैसे, 'smartbook-v2', 'smartbook-v4', आदि)
const cacheName = 'smartbook-v4';

// वे सभी फाइलें जिन्हें आप ऑफलाइन उपलब्ध कराना चाहते हैं
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

// install event: जब सर्विस वर्कर इंस्टॉल होता है
self.addEventListener('install', (e) => {
    console.log('Service Worker: इंस्टॉल हो रहा है...');
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                console.log('Service Worker: फाइलों को कैशिंग कर रहा है');
                return cache.addAll(assets);
            })
            .then(() => {
                // नए सर्विस वर्कर को तुरंत एक्टिवेट करने के लिए फोर्स करें
                console.log('Service Worker: इंतज़ार को स्किप कर रहा है');
                return self.skipWaiting();
            })
            .catch(err => console.log('कैशे में फाइलें जोड़ने में त्रुटि:', err))
    );
});

// activate event: जब सर्विस वर्कर एक्टिवेट होता है
self.addEventListener('activate', (e) => {
    console.log('Service Worker: एक्टिवेट हो गया है');
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    // अगर कैशे का नाम मौजूदा नाम से मेल नहीं खाता है, तो उसे डिलीट करें
                    if (cache !== cacheName) {
                        console.log('Service Worker: पुराने कैशे को हटा रहा है');
                        return caches.delete(cache);
                    }
                })
            ).then(() => {
                // सभी खुले क्लाइंट्स (टैब) का नियंत्रण लेने के लिए
                console.log('Service Worker: क्लाइंट्स पर नियंत्रण ले रहा है');
                return self.clients.claim();
            });
        })
    );
});

// fetch event: जब ऐप कोई रिसोर्स (जैसे, पेज, इमेज, डेटा) मांगता है
self.addEventListener('fetch', (e) => {
    // console.log('Service Worker: डेटा फेच कर रहा है');
    e.respondWith(
        // पहले कैशे में रिसोर्स ढूंढें
        caches.match(e.request).then((cacheRes) => {
            // अगर कैशे में है तो उसे दिखाएं, नहीं तो नेटवर्क से लाएं
            return cacheRes || fetch(e.request);
        })
    );
});
