"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import {
  COLLECTIONS,
  DEFAULT_COUNTRY,
  DEFAULT_TRUST_SCORE,
} from "@/constants/app.constants";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import { profileUpdateSchema } from "@/schemas/profile.schema";
import type { UserProfile } from "@/types/user.types";
import type { ActionResult } from "@/types/common.types";
import { ROUTES } from "@/constants/routes.constants";

export type EnsureUserInput = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export async function ensureUserProfile(input: EnsureUserInput): Promise<void> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.users).doc(input.uid);
  const snap = await ref.get();
  const now = FieldValue.serverTimestamp();
  if (!snap.exists) {
    await ref.set({
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      role: "member",
      trustScore: DEFAULT_TRUST_SCORE,
      country: DEFAULT_COUNTRY,
      phone: null,
      phoneVerified: false,
      bio: null,
      invoiceVerifiedBadge: false,
      totalSavedXof: 0,
      createdAt: now,
      updatedAt: now,
    });
    return;
  }
  await ref.set(
    {
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      updatedAt: now,
    },
    { merge: true },
  );
}

export async function getUserProfileByUid(uid: string): Promise<UserProfile | null> {
  const db = getAdminDb();
  const snap = await db.collection(COLLECTIONS.users).doc(uid).get();
  if (!snap.exists) return null;
  const raw = snap.data() as Omit<UserProfile, "uid" | "phoneVerified"> & {
    phoneVerified?: boolean;
  };
  return {
    ...raw,
    uid,
    phoneVerified: Boolean(raw.phoneVerified),
  } as UserProfile;
}

/** Après liaison du numéro via Firebase Auth (client). */
export async function syncPhoneVerifiedFromFirebaseAction(): Promise<
  ActionResult<void>
> {
  const uid = await requireSessionUid();
  const record = await getAdminAuth().getUser(uid);
  const phone = record.phoneNumber;
  if (!phone) {
    return {
      success: false,
      error:
        "Aucun numéro vérifié. Saisissez le code reçu par SMS ou réessayez.",
    };
  }
  const db = getAdminDb();
  await db.collection(COLLECTIONS.users).doc(uid).set(
    {
      phone,
      phoneVerified: true,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  revalidatePath(ROUTES.CREATE_SUBSCRIPTION);
  revalidatePath(ROUTES.PROFILE);
  return { success: true, data: undefined };
}

export async function updateUserProfile(formData: FormData): Promise<void> {
  const uid = await requireSessionUid();
  const raw = {
    displayName: String(formData.get("displayName") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    country: String(formData.get("country") ?? "SN"),
  };
  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return;
  }
  const db = getAdminDb();
  await db
    .collection(COLLECTIONS.users)
    .doc(uid)
    .set(
      {
        displayName: parsed.data.displayName,
        bio: parsed.data.bio || null,
        phone: parsed.data.phone || null,
        country: parsed.data.country,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  revalidatePath(ROUTES.PROFILE);
}
