/**
 * Firebase Storage upload helper (server-side, Admin SDK).
 *
 * Kräver följande miljövariabler i .env:
 *   FIREBASE_STORAGE_BUCKET  – t.ex. "ditt-projekt.appspot.com"
 *   FIREBASE_SERVICE_ACCOUNT_JSON – innehållet i serviceAccountKey.json (JSON-sträng)
 *
 * Om dessa saknas loggas en varning och funktionen returnerar originalURL/data oförändrad.
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";

// ── Initialisera Firebase Admin (en gång) ─────────────────────────────────────
let _bucket = null;

function getBucket() {
  if (_bucket) return _bucket;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountJson || !storageBucket) {
    return null; // Inte konfigurerat — faller tillbaka på originalbeteende
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    if (!getApps().length) {
      initializeApp({ credential: cert(serviceAccount), storageBucket });
    }
    _bucket = getStorage().bucket();
    return _bucket;
  } catch (e) {
    console.warn("[storage] Kunde inte initialisera Firebase Admin:", e.message);
    return null;
  }
}

// ── Ladda upp en buffer till Firebase Storage ─────────────────────────────────
async function uploadBuffer(buffer, mimeType, folder = "book-images") {
  const bucket = getBucket();
  if (!bucket) return null;

  const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
  const filename = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  const file = bucket.file(filename);
  await file.save(buffer, {
    metadata: { contentType: mimeType },
    resumable: false,
  });

  // Gör filen permanent offentlig och hämta download-URL
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

// ── Ladda ned en URL och ladda upp till Storage ───────────────────────────────
export async function uploadFromUrl(url, format = "classic") {
  const bucket = getBucket();
  if (!bucket) return url; // Ingen Storage-config — returnera originalet

  try {
    const resp = await fetch(url);
    if (!resp.ok) return url;
    const buffer = Buffer.from(await resp.arrayBuffer());
    const mimeType = resp.headers.get("content-type") || "image/jpeg";
    const permanentUrl = await uploadBuffer(buffer, mimeType);
    return permanentUrl || url;
  } catch (e) {
    console.warn("[storage] uploadFromUrl misslyckades:", e.message);
    return url; // Faller tillbaka på originalURL
  }
}

// ── Ladda upp base64-data till Storage ───────────────────────────────────────
// Tar t.ex. "data:image/png;base64,iVBOR..."
export async function uploadFromBase64(dataUrl) {
  const bucket = getBucket();
  if (!bucket) return dataUrl; // Ingen config — returnera base64 as-is

  try {
    const [header, base64] = dataUrl.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
    const buffer = Buffer.from(base64, "base64");
    const permanentUrl = await uploadBuffer(buffer, mimeType);
    return permanentUrl || dataUrl;
  } catch (e) {
    console.warn("[storage] uploadFromBase64 misslyckades:", e.message);
    return dataUrl;
  }
}
