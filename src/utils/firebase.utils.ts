import type { Timestamp } from "firebase/firestore";

export function timestampToDate(value: Timestamp | null | undefined): Date | null {
  if (!value) return null;
  return value.toDate();
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );
}
