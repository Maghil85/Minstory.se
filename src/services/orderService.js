import { db } from "./firebase";
import {
  collection, addDoc, serverTimestamp,
  query, orderBy, where, onSnapshot, doc, updateDoc, getDocs,
} from "firebase/firestore";

/**
 * Sparar en handgjord bokbeställning i Firestore med status "pending".
 * @param {Object} formData - All formulärdata + creationType
 * @returns {string} - Firestore document ID
 */
export async function saveHandgjordOrder(formData) {
  const priceMap = { 15: 349, 20: 499, 24: 599 };
  const order = {
    personName:      formData.personName  || "",
    personAge:       formData.personAge   || "",
    relation:        formData.relation    || "",
    description:     formData.description || "",
    storyIdea:       formData.storyIdea   || "",
    email:           formData.email       || "",
    bookFormat:      formData.bookFormat  || "",
    bookStyle:       formData.bookStyle === "__custom__" ? formData.customBookStyle : (formData.bookStyle || ""),
    pageCount:       Number(formData.pageCount) || 20,
    bookTitle:       formData.storyIdea   || "",
    price:           priceMap[Number(formData.pageCount)] || 499,
    type:            "handgjord",
    status:          "pending",
    createdAt:       serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
}

/**
 * Sparar en AI-bokbeställning i Firestore.
 * @param {Object} formData
 * @param {Object} book - Den genererade boken
 * @returns {string} - Firestore document ID
 */
export async function saveAiOrder(formData, book) {
  const priceMap = { 15: 69, 20: 109, 24: 149 };

  // Spara sidor med text — hoppa över base64-bilder (för stora för Firestore)
  const bookPages = (book?.pages || []).map((p) => ({
    pageNumber: p.pageNumber,
    text: p.text || "",
    imageUrl: (p.imageUrl && !p.imageUrl.startsWith("data:")) ? p.imageUrl : null,
  }));

  const coverImage = (book?.coverImage && !book.coverImage.startsWith("data:"))
    ? book.coverImage : null;

  const order = {
    personName:  formData.personName  || "",
    personAge:   formData.personAge   || "",
    relation:    formData.relation    || "",
    description: formData.description || "",
    storyIdea:   formData.storyIdea   || "",
    email:       formData.email       || "",
    bookFormat:  formData.bookFormat  || "",
    bookStyle:   formData.bookStyle === "__custom__" ? formData.customBookStyle : (formData.bookStyle || ""),
    pageCount:   Number(formData.pageCount) || 20,
    type:        "ai",
    status:      "paid",
    bookTitle:   book?.title || "",
    price:       priceMap[Number(formData.pageCount)] || 109,
    bookPages,
    coverImage,
    createdAt:   serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
}

/**
 * Uppdaterar status på en beställning.
 */
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, "orders", orderId), { status });
}

/**
 * Prenumererar på alla beställningar, sorterade nyast först.
 * @param {Function} onData - (orders: Array) => void
 * @returns unsubscribe-funktion
 */
export function subscribeOrders(onData) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(orders);
  });
}

/**
 * Prenumererar på en kunds egna beställningar (filtrerat på email).
 * @param {string} email - Kundens e-post
 * @param {Function} onData - (orders: Array) => void
 * @returns unsubscribe-funktion
 */
export function subscribeCustomerOrders(email, onData) {
  const q = query(
    collection(db, "orders"),
    where("email", "==", email),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(orders);
  });
}

// ── Support-meddelanden ────────────────────────────────────────────────────────

/**
 * Skickar ett supportmeddelande (kund eller admin).
 */
export async function sendSupportMessage({ orderId, senderType, text, senderName, senderEmail, subject }) {
  await addDoc(collection(db, "support"), {
    orderId:     orderId || null,
    senderType,  // "customer" | "admin"
    senderName:  senderName  || (senderType === "admin" ? "Admin" : "Kund"),
    senderEmail: senderEmail || null,
    subject:     subject     || null,
    text,
    createdAt:   serverTimestamp(),
    read:        false,
  });
}

/**
 * Markerar meddelanden som lästa.
 */
export async function markMessagesRead(msgIds) {
  await Promise.all(msgIds.map((id) => updateDoc(doc(db, "support", id), { read: true })));
}

/**
 * Prenumererar på supportmeddelanden (alla eller för ett specifikt orderId).
 */
export function subscribeSupport(onData, orderId = null) {
  let q;
  if (orderId) {
    q = query(
      collection(db, "support"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((m) => m.orderId === orderId || m.orderId === null);
      onData(msgs);
    });
  }
  q = query(collection(db, "support"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onData(msgs);
  });
}

