import "server-only";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { ServiceAccount } from "firebase-admin";
import { serviceAccount } from "./serviceAccount";

let cachedApp: admin.app.App | null = null;

export function getAdminApp(): admin.app.App {
  if (cachedApp) return cachedApp;
  if (admin.apps.length > 0) {
    cachedApp = admin.app();
    return cachedApp;
  }
  const { projectId, clientEmail, privateKey } = serviceAccount;
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin : définissez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY.",
    );
  }
  cachedApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    } as ServiceAccount),
  });
  return cachedApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
