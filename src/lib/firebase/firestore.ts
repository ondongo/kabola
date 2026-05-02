import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./app";

let cachedDb: Firestore | null = null;

export function getDb(): Firestore {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase client non configuré : renseignez NEXT_PUBLIC_FIREBASE_* dans .env.local puis redémarrez le serveur de dev.",
    );
  }
  if (!cachedDb) cachedDb = getFirestore(app);
  return cachedDb;
}

export {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  getDocs,
  getDoc,
  doc,
  or,
  deleteDoc,
  documentId,
  serverTimestamp,
  limit,
  QueryDocumentSnapshot,
  setDoc,
  FieldValue,
  getCountFromServer,
  startAfter,
  startAt,
  increment,
  collectionGroup,
  QuerySnapshot,
  runTransaction,
  arrayUnion,
  arrayRemove,
  writeBatch,
  deleteField,
  endBefore,
  Timestamp,
} from "firebase/firestore";
