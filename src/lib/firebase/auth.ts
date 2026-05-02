import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirebaseApp } from "./app";

let cachedAuth: Auth | null = null;
let cachedGoogleProvider: GoogleAuthProvider | null = null;

export function getClientAuth(): Auth {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase client non configuré : renseignez NEXT_PUBLIC_FIREBASE_* dans .env.local puis redémarrez le serveur de dev.",
    );
  }
  if (!cachedAuth) cachedAuth = getAuth(app);
  return cachedAuth;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!cachedGoogleProvider) {
    cachedGoogleProvider = new GoogleAuthProvider();
    cachedGoogleProvider.setCustomParameters({ prompt: "select_account" });
  }
  return cachedGoogleProvider;
}

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
