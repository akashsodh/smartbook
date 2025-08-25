// sw.js

// **महत्वपूर्ण:** जब भी आप कोई टेस्ट सीरीज़ या कोई और फाइल अपडेट करें,
// तो इस संस्करण को बदलें (जैसे, 'smartbook-v9', 'smartbook-v10', आदि)
const cacheName = 'smartbookai-v11';

// वे सभी फाइलें जिन्हें आप ऑफलाइन उपलब्ध कराना चाहते हैं
const assets = [
    '/',
    '/index.html',
    '/raj_police_tests.html',
    '/vdo_rajasthan_tests.html',
    '/quiz.html',
    '/style.css',
    '/homepage.style.css',
    '/manifest.json',
    '/test.json',
    '/subjects.json',
    '/2025.json',
    '/computer.json', 
    '/disha_hindi.json',
    '/disha_india_gk.json',
    '/disha_india_polity.json',
    '/disha_world_gk.json',
    '/raj_arts_culture_pyq.json',
    '/raj_geography_pyq.json',
    '/raj_current.json',
    '/kalam_maths.json',
    '/patwartest.json',
    '/images/icons/banner.png',
    '/images/icons/icon-192x192.png',
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

// fetch event: जब कोई नेटवर्क अनुरोध किया जाता है
self.addEventListener('fetch', (e) => {
    // JSON फ़ाइलों के लिए, हमेशा नेटवर्क से नवीनतम लाने का प्रयास करें।
    // यह सुनिश्चित करता है कि आप हमेशा नवीनतम प्रश्न प्राप्त करें, यदि ऑनलाइन हैं।
    if (e.request.url.includes('.json')) {
        e.respondWith(
            fetch(e.request)
                .then(fetchRes => {
                    // सफल प्रतिक्रिया मिलने पर, इसे कैशे में डालें और लौटाएँ
                    return caches.open(cacheName).then(cache => {
                        cache.put(e.request.url, fetchRes.clone());
                        return fetchRes;
                    });
                })
                .catch(() => {
                    // यदि नेटवर्क विफल होता है, तो कैशे से लौटाएँ
                    return caches.match(e.request);
                })
        );
    } else {
        // अन्य सभी अनुरोधों (HTML, CSS, JS, Images) के लिए, पहले कैशे देखें।
        // यह ऐप को तेजी से लोड करता है और ऑफ़लाइन काम करने देता है।
        e.respondWith(
            caches.match(e.request).then(cacheRes => cacheRes || fetch(e.request))
        );
    }
});
