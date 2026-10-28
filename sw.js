/* Borne vidéo — fonctionnement hors ligne
   Stratégie : on essaie toujours d'abord le réseau (pour récupérer les
   modifications de config.js), et si le réseau ne répond pas en 3 s ou
   n'est pas disponible, on sert la copie enregistrée sur l'iPad.        */

const CACHE = 'borne-video-v4-5';
const FILES = ['./', './index.html', './config.js', './manifest.webmanifest',
  './fonts/Jost-Medium.ttf', './fonts/Jost-Bold.ttf', './fonts/Jost-ExtraBold.ttf', './fdp-logo-blanc.svg',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo-content-camp.png',
  './vendor/pose3d.js', './opfs-zip.js', './models/mannequin.glb', './vendor/face-api.esm.js',
  './models/tiny_face_detector_model-weights_manifest.json', './models/tiny_face_detector_model.bin',
  './models/face_expression_model-weights_manifest.json', './models/face_expression_model.bin',
  './models/face_landmark_68_tiny_model-weights_manifest.json', './models/face_landmark_68_tiny_model.bin'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !k.startsWith('borne-export')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  { const u = new URL(req.url);
    if (req.method === 'GET' && u.origin === self.location.origin && /\/__export\/[^/]+\.zip$/.test(u.pathname)) { e.respondWith(exportZip(e)); return; } }
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const net = await Promise.race([
        fetch(req, { cache: 'no-store' }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
      ]);
      if (net && net.ok) cache.put(req, net.clone());
      return net;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const home = await cache.match('./index.html');
        if (home) return home;
      }
      throw err;
    }
  })());
});


/* ==========================================================================
   Export en UN SEUL fichier ZIP, écrit au fil de l'eau.
   Pourquoi : le partage Safari (AirDrop) charge TOUS les fichiers en mémoire avant d'envoyer ;
   au-delà de quelques Go, l'app plante. Ici, les vidéos sont lues une par une dans la base de
   l'iPad et envoyées au téléchargement par petits morceaux : la mémoire utilisée reste faible
   quelle que soit la taille (20 Go et plus). ZIP « stocké » (vidéos non recompressées), format
   ZIP64 au-delà de 4 Go, taille totale annoncée d'avance (le téléchargement échoue s'il est tronqué).
   La page prépare la liste (manifeste) et calcule les CRC ; ce code ne fait que les lire et les envoyer.
   ========================================================================== */
const EXP_CACHE = 'borne-export';
const U32 = 0xFFFFFFFF;
const enc = new TextEncoder();

/* --- CRC32 --- */
const CRC_T = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
function crcBytes(buf, crc) { let c = ~(crc | 0); for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 255] ^ (c >>> 8); return ~c >>> 0; }
/* CRC d'une suite de n zéros (essai de transfert) : zlib crc32_combine, en O(log n) */
function gf2times(mat, vec) { let sum = 0, i = 0; while (vec) { if (vec & 1) sum ^= mat[i]; vec >>>= 1; i++; } return sum >>> 0; }
function gf2square(sq, mat) { for (let n = 0; n < 32; n++) sq[n] = gf2times(mat, mat[n]); }
function crcCombine(crc1, crc2, len2) {
  if (len2 <= 0) return crc1 >>> 0;
  const even = new Array(32), odd = new Array(32);
  odd[0] = 0xEDB88320; let row = 1; for (let n = 1; n < 32; n++) { odd[n] = row; row <<= 1; }
  gf2square(even, odd); gf2square(odd, even);
  do {
    gf2square(even, odd); if (len2 & 1) crc1 = gf2times(even, crc1); len2 = Math.floor(len2 / 2); if (!len2) break;
    gf2square(odd, even); if (len2 & 1) crc1 = gf2times(odd, crc1); len2 = Math.floor(len2 / 2);
  } while (len2);
  return (crc1 ^ crc2) >>> 0;
}
function crcZeros(n) {   // CRC32 de n octets nuls
  let res = 0, resLen = 0, blk = crcBytes(new Uint8Array(1), 0), blkLen = 1, k = n;
  while (k > 0) { if (k % 2) { res = resLen ? crcCombine(res, blk, blkLen) : blk; resLen += blkLen; } blk = crcCombine(blk, blk, blkLen); blkLen *= 2; k = Math.floor(k / 2); }
  return res >>> 0;
}

/* --- Lecture d'une vidéo dans la base de la borne --- */
let dbp = null;
function openDb() {
  if (!dbp) dbp = new Promise((res, rej) => { const r = indexedDB.open('borne-video'); r.onsuccess = () => res(r.result); r.onerror = () => { dbp = null; rej(r.error); }; });
  return dbp;
}
async function getBlob(id) {
  const db = await openDb();
  const v = await new Promise((res, rej) => { const q = db.transaction('blobs').objectStore('blobs').get(id); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  if (!v) throw new Error('vidéo introuvable (id ' + id + ')');
  return v.buffer instanceof ArrayBuffer ? new Blob([v.buffer], { type: v.type || 'video/mp4' }) : v;
}

/* --- Structure du ZIP --- */
function dosTime(ms) {
  const d = new Date(ms || Date.now());
  return { t: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), d: (Math.max(0, d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() };
}
function localHeader(en) {
  const b = new Uint8Array(30 + en.name.length), v = new DataView(b.buffer);
  v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true); v.setUint16(8, 0, true);
  v.setUint16(10, en.dt.t, true); v.setUint16(12, en.dt.d, true); v.setUint32(14, en.crc >>> 0, true);
  v.setUint32(18, en.size, true); v.setUint32(22, en.size, true); v.setUint16(26, en.name.length, true); v.setUint16(28, 0, true);
  b.set(en.name, 30); return b;
}
function centralDir(entries, cdOffset) {
  let len = 0; entries.forEach(en => { en.big = en.offset >= U32; len += 46 + en.name.length + (en.big ? 12 : 0); });
  const z64 = cdOffset >= U32 || entries.length >= 0xFFFF || len >= U32;
  const out = new Uint8Array(len + (z64 ? 56 + 20 : 0) + 22), v = new DataView(out.buffer); let p = 0;
  entries.forEach(en => {
    v.setUint32(p, 0x02014b50, true); v.setUint16(p + 4, en.big ? 45 : 20, true); v.setUint16(p + 6, en.big ? 45 : 20, true); v.setUint16(p + 8, 0x0800, true); v.setUint16(p + 10, 0, true);
    v.setUint16(p + 12, en.dt.t, true); v.setUint16(p + 14, en.dt.d, true); v.setUint32(p + 16, en.crc >>> 0, true);
    v.setUint32(p + 20, en.size, true); v.setUint32(p + 24, en.size, true); v.setUint16(p + 28, en.name.length, true); v.setUint16(p + 30, en.big ? 12 : 0, true);
    v.setUint16(p + 32, 0, true); v.setUint16(p + 34, 0, true); v.setUint16(p + 36, 0, true); v.setUint32(p + 38, 0, true); v.setUint32(p + 42, en.big ? U32 : en.offset, true);
    out.set(en.name, p + 46); p += 46 + en.name.length;
    if (en.big) { v.setUint16(p, 1, true); v.setUint16(p + 2, 8, true); v.setBigUint64(p + 4, BigInt(en.offset), true); p += 12; }
  });
  if (z64) {
    const z = p;
    v.setUint32(p, 0x06064b50, true); v.setBigUint64(p + 4, 44n, true); v.setUint16(p + 12, 45, true); v.setUint16(p + 14, 45, true); v.setUint32(p + 16, 0, true); v.setUint32(p + 20, 0, true);
    v.setBigUint64(p + 24, BigInt(entries.length), true); v.setBigUint64(p + 32, BigInt(entries.length), true); v.setBigUint64(p + 40, BigInt(len), true); v.setBigUint64(p + 48, BigInt(cdOffset), true); p += 56;
    v.setUint32(p, 0x07064b50, true); v.setUint32(p + 4, 0, true); v.setBigUint64(p + 8, BigInt(cdOffset + len), true); v.setUint32(p + 16, 1, true); p += 20;
  }
  v.setUint32(p, 0x06054b50, true); v.setUint16(p + 4, 0, true); v.setUint16(p + 6, 0, true);
  v.setUint16(p + 8, z64 ? 0xFFFF : entries.length, true); v.setUint16(p + 10, z64 ? 0xFFFF : entries.length, true);
  v.setUint32(p + 12, z64 ? U32 : len, true); v.setUint32(p + 16, z64 ? U32 : cdOffset, true); v.setUint16(p + 20, 0, true);
  return out;
}

async function exportZip(e) {
  try {
    const c = await caches.open(EXP_CACHE);
    const fname = decodeURIComponent(new URL(e.request.url).pathname.split('/').pop());
    const hit = await c.match('m-' + encodeURIComponent(fname) + '.json');
    if (!hit) return new Response('Aucune liste d\'export préparée pour ' + fname + ' : retournez dans la borne et touchez « 1. Préparer ».', { status: 409 });
    const man = await hit.json();
    const entries = []; let off = 0;
    for (const f of man.files) {
      const en = { name: enc.encode(f.name), dt: dosTime(f.at), id: f.id, fake: !!f.fake };
      if (typeof f.text === 'string') { en.bytes = enc.encode(f.text); en.size = en.bytes.length; en.crc = crcBytes(en.bytes, 0); }
      else { en.size = f.size; en.crc = f.fake ? crcZeros(f.size) : f.crc; }
      en.offset = off; off += 30 + en.name.length + en.size; entries.push(en);
    }
    const cd = centralDir(entries, off), total = off + cd.length;
    let sent = 0, lastT = 0, i = 0, phase = 0, reader = null, got = 0, cdDone = false, opened = false;
    const note = async (type, extra) => { for (const cl of await self.clients.matchAll({ includeUncontrolled: true })) cl.postMessage(Object.assign({ type, sent, total, name: fname, token: man.token }, extra || {})); };
    const push = (ctrl, b) => { ctrl.enqueue(b); sent += b.length; const t = Date.now(); if (t - lastT > 400) { lastT = t; note('export-progress'); } };
    note('export-start');   // le service worker a bien reçu la demande de téléchargement
    let resolveDone; const done = new Promise(r => { resolveDone = r; }); e.waitUntil(done);
    const stream = new ReadableStream({
      async pull(ctrl) {
        try {
          if (!opened) { opened = true; note('export-open'); }   // Safari commence à lire le flux
          for (;;) {
            if (i < entries.length) {
              const en = entries[i];
              if (phase === 0) { push(ctrl, localHeader(en)); phase = 1; got = 0; return; }
              if (phase === 1) {
                if (en.bytes) { push(ctrl, en.bytes); phase = 2; continue; }
                if (en.fake) { const n = Math.min(1 << 20, en.size - got); if (n <= 0) { phase = 2; continue; } got += n; push(ctrl, new Uint8Array(n)); return; }
                if (!reader) { const b = await getBlob(en.id); if (b.size !== en.size) throw new Error('taille différente pour ' + new TextDecoder().decode(en.name) + ' (' + b.size + ' au lieu de ' + en.size + ')'); reader = b.stream().getReader(); }
                const r = await reader.read();
                if (r.done) { if (got !== en.size) throw new Error('lecture incomplète : ' + new TextDecoder().decode(en.name)); reader = null; phase = 2; continue; }
                got += r.value.length; push(ctrl, r.value); return;
              }
              i++; phase = 0; continue;
            }
            if (!cdDone) { cdDone = true; push(ctrl, cd); return; }
            ctrl.close(); await note('export-progress'); await note('export-done'); resolveDone(); return;
          }
        } catch (err) { await note('export-error', { msg: String(err && err.message || err) }); resolveDone(); ctrl.error(err); }
      },
      cancel() { try { if (reader) reader.cancel(); } catch (x) {} note('export-cancel'); resolveDone(); }
    }, new ByteLengthQueuingStrategy({ highWaterMark: 4 << 20 }));
    return new Response(stream, { status: 200, headers: {
      'Content-Type': 'application/zip', 'Content-Length': String(total),
      'Content-Disposition': 'attachment; filename="' + (man.zipName || 'Videos-borne.zip') + '"', 'Cache-Control': 'no-store' } });
  } catch (err) { return new Response('Export impossible : ' + (err && err.message || err), { status: 500 }); }
}

/* La page envoie un « ping » pendant l'export pour que l'iPad ne mette pas ce code en veille */
self.addEventListener('message', (e) => { if (e.data && e.data.type === 'ping' && e.source) e.source.postMessage({ type: 'pong' }); });
