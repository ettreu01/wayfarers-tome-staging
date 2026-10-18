// Wayfarer’s Tome V3.0B Alpha 6.4.1.1 — offline app shell, same-origin only.
const CACHE='wayfarers-tome-staging-shell-v3.0.0-alpha.3.34';
const SHELL=['./','./index.html','./adventurer-ready.webp'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('wayfarers-tome-staging-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const url=new URL(request.url);
 // Version checking must always reach the server; never claim cached metadata is current.
 if(url.pathname.endsWith('/version.json')||url.pathname.endsWith('/sw.js'))return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)))}
   return response;
  }).catch(async()=>await caches.match('./index.html')||Response.error()));
 }
});
