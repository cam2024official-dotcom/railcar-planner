const V="tcp-v1";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:"reload"})).then(r=>c.put(f,r))))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET")return;
 const page=r.mode==="navigate"||(r.headers.get("accept")||"").includes("text/html");
 if(page){
  e.respondWith(
   Promise.race([fetch(r.url,{cache:"no-cache"}),new Promise((_,j)=>setTimeout(j,3000))])
    .then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(r,c));return n})
    .catch(()=>caches.match(r).then(m=>m||caches.match("index.html")))
  );
  return;
 }
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(r,c));return n})));
});
