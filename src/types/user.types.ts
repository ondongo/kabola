import type { UserRole } from "./common.types";
import type { Timestamp } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  trustScore: number;
  country: string;
  phone: string | null;
  /** True après confirmation SMS (Firebase Phone) ou admin. */
  phoneVerified: boolean;
  bio: string | null;
  invoiceVerifiedBadge: boolean;
  totalSavedXof: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
