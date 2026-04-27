import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Skapar ett Firebase Auth-konto och kopplar alla ordrar med det orderId till användaren.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @param {string|null} orderId — Firestore-id för beställningen som ska kopplas
 * @returns {{ uid: string }}
 */
export async function createAccountAndLinkBook(email, password, displayName, orderId) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  if (orderId) {
    await updateDoc(doc(db, "orders", orderId), { userId: uid, userEmail: email });
  }

  return { uid };
}
