import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseApp } from "./app";

let cachedStorage: FirebaseStorage | null = null;

export function getFirebaseStorageClient(): FirebaseStorage {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase client non configuré : renseignez NEXT_PUBLIC_FIREBASE_* dans .env.local.",
    );
  }
  if (!cachedStorage) cachedStorage = getStorage(app);
  return cachedStorage;
}

export {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata,
  listAll,
} from "firebase/storage";
