import { z } from "zod";

export const invoiceUploadMetadataSchema = z.object({
  subscriptionId: z.string().min(8),
  storagePath: z.string().min(4),
  fileName: z.string().min(1).max(240),
  mimeType: z.string().min(3).max(120),
  fileSize: z.coerce.number().int().min(1).max(12 * 1024 * 1024),
  declaredAmountXof: z.coerce.number().int().min(0).optional(),
  declaredMerchant: z.string().max(120).optional().or(z.literal("")),
});

export type InvoiceUploadMetadataInput = z.infer<typeof invoiceUploadMetadataSchema>;
