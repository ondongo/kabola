import type { VerificationStatus } from "./common.types";
import type { Timestamp } from "firebase/firestore";

export type InvoiceOcrHints = {
  rawTextSample: string;
  detectedAmountXof: number | null;
  detectedPeriod: string | null;
  detectedMerchant: string | null;
};

export type InvoiceRecord = {
  id: string;
  userId: string;
  subscriptionId: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  status: VerificationStatus;
  confidenceScore: number;
  ocrHints: InvoiceOcrHints | null;
  anomalyFlags: string[];
  reviewNotes: string | null;
  reviewedByUid: string | null;
  reviewedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
