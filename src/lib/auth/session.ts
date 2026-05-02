import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-constants";

export { SESSION_COOKIE_NAME };

export async function getSessionUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function requireSessionUid(): Promise<string> {
  const uid = await getSessionUid();
  if (!uid) {
    throw new Error("Authentification requise.");
  }
  return uid;
}
