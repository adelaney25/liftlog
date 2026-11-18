const V = 'liftlog-v1'; // bump when you change any file
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const CDN = [
  'https://cdn.tailwindcss.com/3.4.17',
  'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/htm@3.1.1/dist/htm.umd.js',
  'https://cdn.jsdelivr.net/npm/lucide-react@0.383.0/dist/umd/lucide-react.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(async c => {
    await c.addAll(SHELL);
    await Promise.all(CDN.map(u => c.add(u).catch(() => {})));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(V).then(c => c.put(req, cp)); }
    return res;
  }).catch(() => req.mode === 'navigate' ? caches.match('index.html') : Response.error())));
});
