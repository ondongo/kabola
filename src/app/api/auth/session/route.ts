import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { ensureUserProfile } from "@/services/user.service";
import { firebaseIdTokenSchema } from "@/schemas/auth.schema";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-constants";

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5;

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = firebaseIdTokenSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Jeton invalide." }, { status: 400 });
    }
    const { idToken } = parsed.data;
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    await ensureUserProfile({
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
      photoURL: decoded.picture ?? null,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Session refusée.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
