import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { firebaseConfig } from "./config";

export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig as FirebaseOptions);
}
