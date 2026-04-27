/**
 * seed-firestore.js
 *
 * Skapar ett placeholder-dokument i varje Firestore-collection
 * så att de syns i Firebase Console direkt.
 *
 * Kör med: node server/seed-firestore.js
 *
 * Kräver: FIREBASE_SERVICE_ACCOUNT_JSON + FIREBASE_STORAGE_BUCKET i .env
 */

import "dotenv/config";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ── Init ────────────────────────────────────────────────────────────────────
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  console.error("Saknar FIREBASE_SERVICE_ACCOUNT_JSON i .env");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountJson);
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app, "default");

// ── Seed-data ────────────────────────────────────────────────────────────────
async function seed() {
  console.log("Startar seed av Firestore-collections...\n");

  // orders
  const orderRef = await db.collection("orders").add({
    personName: "Testperson",
    personAge: "8",
    relation: "barn",
    description: "En glad och nyfiken flicka som älskar dinosaurier.",
    storyIdea: "Vill ha en bok om en dinosaurie som räddar sin by.",
    email: "test@example.com",
    bookFormat: "classic",
    bookStyle: "sagolik",
    pageCount: 10,
    bookTitle: "Dino och den magiska skogen",
    price: 299,
    type: "ai",
    status: "pending",
    bookPages: [],
    coverImage: null,
    createdAt: FieldValue.serverTimestamp(),
    _seed: true,
  });
  console.log(`✓ orders/${orderRef.id}`);

  // support
  const supportRef = await db.collection("support").add({
    orderId: orderRef.id,
    senderType: "customer",
    senderName: "Testperson",
    senderEmail: "test@example.com",
    subject: "Fråga om min beställning",
    text: "Hej! Undrar när min bok är klar?",
    read: false,
    createdAt: FieldValue.serverTimestamp(),
    _seed: true,
  });
  console.log(`✓ support/${supportRef.id}`);

  // printOrders
  const printRef = await db.collection("printOrders").add({
    orderId: orderRef.id,
    bookTitle: "Dino och den magiska skogen",
    bookFormat: "classic",
    printOption: "soft",
    totalPrice: 199,
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
    _seed: true,
  });
  console.log(`✓ printOrders/${printRef.id}`);

  console.log("\nSeed klar! Du kan nu se alla tre collections i Firebase Console.");
  console.log("OBS: Dokumenten är märkta med '_seed: true' och kan raderas manuellt.\n");
}

seed().catch((err) => {
  console.error("Seed misslyckades:", err);
  process.exit(1);
});
