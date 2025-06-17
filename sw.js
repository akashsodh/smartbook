// कैश का नाम बदल दें ताकि ब्राउज़र नया कैश बनाए
const CACHE_NAME = 'smartbook-quiz-cache-v13'; 

const urlsToCache = [
  '/smartbook/',
  '/smartbook/index.html',
  '/smartbook/quiz.html',
  '/smartbook/homepage.style.css',
  '/smartbook/style.css',
  '/smartbook/subjects.json',
  '/smartbook/rajasthan_history.json',
  '/smartbook/class9.json',
  '/smartbook/dishageography.json',
  '/smartbook/lib_unit1.json',
  '/smartbook/lib_unit2.json',
  '/smartbook/lib_unit3.json',
  '/smartbook/lib_unit4.json',  
  '/smartbook/manifest.json', // इसे भी कैश करें
  '/smartbook/icons/icon-192x192.png',
  '/smartbook/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// --- बाकी का सर्विस वर्कर कोड (install और fetch वाला) वैसा ही रहेगा ---

// सर्विस वर्कर इंस्टॉल होने पर फ़ाइलों को कैश करें
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache खोला गया');
        return cache.addAll(urlsToCache);
      })
  );
});

// नेटवर्क रिक्वेस्ट को हैंडल करें
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // अगर रिक्वेस्ट कैश में है, तो उसे लौटाएँ
        if (response) {
          return response;
        }
        // अगर नहीं है, तो नेटवर्क से फ़ेच करें
        return fetch(event.request);
      })
  );
});
