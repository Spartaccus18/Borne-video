/* Borne vidéo — écriture d'un fichier ZIP dans le stockage privé de l'app (OPFS), hors de la page.
   Pourquoi : dans l'app installée sur l'écran d'accueil, iOS gère mal les téléchargements ; la page propose
   ensuite ce fichier à la feuille de partage (AirDrop, Fichiers). Les vidéos sont lues une par une dans la base
   de l'iPad et écrites au fil de l'eau : la mémoire utilisée reste faible, quelle que soit la taille.
   Le ZIP est « stocké » (sans recompression), ZIP64 au-delà de 4 Go. La somme de contrôle de chaque vidéo est
   recalculée pendant l'écriture et comparée à celle de la préparation.
   NB : la structure du ZIP est la même que dans sw.js (téléchargement Safari). */
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

  const T8 = (() => {
    const t = new Int32Array(256 * 8);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
    for (let n = 0; n < 256; n++) { let c = t[n]; for (let k = 1; k < 8; k++) { c = t[c & 255] ^ (c >>> 8); t[k * 256 + n] = c; } }
    return t;
  })();
  function crcUpdate(c, b) {
    let i = 0; const n = b.length;
    for (; i + 8 <= n; i += 8) {
      const lo = c ^ (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24));
      c = T8[1792 + (lo & 255)] ^ T8[1536 + ((lo >>> 8) & 255)] ^ T8[1280 + ((lo >>> 16) & 255)] ^ T8[1024 + (lo >>> 24)] ^ T8[768 + b[i + 4]] ^ T8[512 + b[i + 5]] ^ T8[256 + b[i + 6]] ^ T8[b[i + 7]];
    }
    for (; i < n; i++) c = T8[(c ^ b[i]) & 255] ^ (c >>> 8);
    return c;
  }

const zeros = new Uint8Array(1 << 20);
let dbp = null;
function openDb() { if (!dbp) dbp = new Promise((res, rej) => { const r = indexedDB.open('borne-video'); r.onsuccess = () => res(r.result); r.onerror = () => { dbp = null; rej(r.error); }; }); return dbp; }
async function getBlob(id) {
  const db = await openDb();
  const v = await new Promise((res, rej) => { const q = db.transaction('blobs').objectStore('blobs').get(id); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  if (!v) throw new Error('vidéo introuvable (id ' + id + ')');
  return v.buffer instanceof ArrayBuffer ? new Blob([v.buffer], { type: v.type || 'video/mp4' }) : v;
}
let cancelled = false;
self.onmessage = async (ev) => {
  const d = ev.data || {};
  if (d.type === 'cancel') { cancelled = true; return; }
  if (d.type !== 'start') return;
  const { name, files } = d; let ah = null, root = null;
  try {
    const entries = []; let off = 0;
    for (const f of files) {
      const en = { name: enc.encode(f.name), dt: dosTime(f.at), id: f.id, fake: !!f.fake, size: f.size };
      en.crc = f.fake ? crcZeros(f.size) : f.crc; en.offset = off; off += 30 + en.name.length + en.size; entries.push(en);
    }
    const cd = centralDir(entries, off), total = off + cd.length;
    root = await navigator.storage.getDirectory();
    const fh = await root.getFileHandle(name, { create: true });
    ah = await fh.createSyncAccessHandle(); ah.truncate(0);
    let pos = 0, lastT = 0;
    const wr = (u8) => {
      let o = 0;
      while (o < u8.length) { const n = ah.write(o ? u8.subarray(o) : u8, { at: pos + o }); if (!(n > 0)) throw new Error('écriture impossible (place insuffisante sur l\'iPad ?)'); o += n; }
      pos += u8.length; const t = Date.now(); if (t - lastT > 300) { lastT = t; postMessage({ type: 'progress', pos, total }); }
    };
    for (const en of entries) {
      if (cancelled) throw new Error('annulé');
      wr(localHeader(en));
      if (en.fake) { let left = en.size; while (left > 0) { const n = Math.min(zeros.length, left); wr(n === zeros.length ? zeros : zeros.subarray(0, n)); left -= n; if (cancelled) throw new Error('annulé'); await 0; } continue; }
      const b = await getBlob(en.id);
      if (b.size !== en.size) throw new Error('taille différente pour ' + new TextDecoder().decode(en.name) + ' (' + b.size + ' au lieu de ' + en.size + ')');
      const rd = b.stream().getReader(); let c = -1, got = 0;
      for (;;) {
        const r = await rd.read(); if (r.done) break;
        if (cancelled) { try { rd.cancel(); } catch (e) {} throw new Error('annulé'); }
        c = crcUpdate(c, r.value); got += r.value.length; wr(r.value);
      }
      if (got !== en.size) throw new Error('lecture incomplète : ' + new TextDecoder().decode(en.name));
      if (((~c) >>> 0) !== (en.crc >>> 0)) throw new Error('somme de contrôle différente : ' + new TextDecoder().decode(en.name));
    }
    wr(cd); ah.flush(); const sz = ah.getSize(); ah.close(); ah = null;
    if (sz !== total) throw new Error('taille écrite ' + sz + ' au lieu de ' + total);
    postMessage({ type: 'done', total });
  } catch (err) {
    try { if (ah) ah.close(); } catch (e) {}
    try { if (root) await root.removeEntry(name); } catch (e) {}
    const q = err && err.name === 'QuotaExceededError';
    postMessage({ type: 'error', msg: q ? 'place insuffisante sur l\'iPad pour ce fichier (choisissez une taille de fichier plus petite)' : String(err && err.message || err), name: err && err.name });
  }
};
