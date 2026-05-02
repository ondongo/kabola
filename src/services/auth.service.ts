"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-constants";
import type { ActionResult } from "@/types/common.types";

/** Révoque le cookie de session côté serveur (ex. après déconnexion Firebase côté client). */
export async function revokeServerSession(): Promise<ActionResult> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true, data: undefined };
}
