// SoulArt Temple Service Worker
const CACHE_NAME = 'soulart-temple-v1.0.1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/Logo.png',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/SoulArt_Allergy_Identification.csv'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('SoulArt Temple SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SoulArt Temple SW: Caching essential files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('SoulArt Temple SW: Skip waiting and take control');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('SoulArt Temple SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('SoulArt Temple SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SoulArt Temple SW: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - use appropriate caching strategy based on request type
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (different origins)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);

  // Never cache API requests - always go to network for fresh data
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For navigation requests (HTML pages) - Network first with cache fallback
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Valid response - clone and cache
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed - try cache, fallback to index
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/');
            });
        })
    );
    return;
  }

  // For static assets (CSS, JS, images) - Stale while revalidate
  if (event.request.destination === 'style' || 
      event.request.destination === 'script' || 
      event.request.destination === 'image' ||
      event.request.destination === 'font' ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.json') ||
      url.pathname.endsWith('.csv')) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Always try to fetch fresh version in background
          const fetchPromise = fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });

          // Return cached version immediately if available, otherwise wait for fetch
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // For everything else - just fetch from network
  event.respondWith(fetch(event.request));
});

// Handle background sync for future features
self.addEventListener('sync', (event) => {
  console.log('SoulArt Temple SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'journal-sync') {
    event.waitUntil(syncJournalEntries());
  }
});

// Function to sync journal entries when back online
async function syncJournalEntries() {
  try {
    // This will be used for future journal sync functionality
    console.log('SoulArt Temple SW: Syncing journal entries...');
    // Implementation will be added when journal sync is needed
  } catch (error) {
    console.error('SoulArt Temple SW: Sync failed:', error);
  }
}

// Handle push notifications for future features
self.addEventListener('push', (event) => {
  console.log('SoulArt Temple SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New spiritual guidance awaits you',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open SoulArt Temple'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SoulArt Temple', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('SoulArt Temple SW: Notification clicked');
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});