import type { NotificationKind } from "./common.types";
import type { Timestamp } from "firebase/firestore";

export type NotificationRecord = {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  /** Renseigné lors du passage à lu */
  readAt: Timestamp | null;
  data: Record<string, string> | null;
  createdAt: Timestamp;
};
