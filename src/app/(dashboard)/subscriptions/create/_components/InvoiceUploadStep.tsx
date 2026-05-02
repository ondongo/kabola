"use client";

import { useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorageClient } from "@/lib/firebase/storage";
import { getClientAuth } from "@/lib/firebase/auth";
import { STORAGE_PATHS } from "@/constants/app.constants";
import { finalizeInvoiceAfterUpload } from "@/services/invoice.service";
import Button from "@/components/atoms/Button";
import { Icons } from "@/constants/icons.constants";

type Props = {
  subscriptionId: string;
  onComplete: () => void;
  onSkip: () => void;
};

export default function InvoiceUploadStep({
  subscriptionId,
  onComplete,
  onSkip,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const auth = getClientAuth();
    const user = auth.currentUser;
    if (!user) {
      setError("Session expirée. Reconnectez-vous pour envoyer la facture.");
      return;
    }

    const allowed =
      file.type === "application/pdf" ||
      file.type === "image/png" ||
      file.type === "image/jpeg";
    if (!allowed) {
      setError("Formats acceptés : PDF, PNG ou JPEG.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 12 Mo).");
      return;
    }

    setBusy(true);
    try {
      const safeName =
        file.name.replace(/[^\w.\-àâäéèêëïîôùûç\s]/gi, "_").slice(0, 200) ||
        "facture";
      const storagePath = STORAGE_PATHS.invoices(
        user.uid,
        subscriptionId,
        safeName,
      );
      const storage = getFirebaseStorageClient();
      await uploadBytes(ref(storage, storagePath), file, {
        contentType: file.type,
      });

      const result = await finalizeInvoiceAfterUpload({
        subscriptionId,
        storagePath,
        fileName: safeName,
        mimeType: file.type,
        fileSize: file.size,
      });

      if (!result.success) {
        const err =
          typeof result.error === "string"
            ? result.error
            : "Envoi impossible pour le moment.";
        setError(err);
        return;
      }
      onComplete();
    } catch {
      setError("Échec de l’envoi. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Recommandé
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Ajoutez une facture ou un reçu pour obtenir le badge « facture vérifiée »
          et rassurer les co-abonnés.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white px-6 py-12 transition hover:border-primary/40 hover:bg-primary-light/30">
        <Icons.fileText className="text-text-muted" size={36} />
        <span className="mt-3 text-sm font-semibold text-text">
          Glisser-déposer ou cliquer pour choisir un fichier
        </span>
        <span className="mt-1 text-xs text-text-muted">PDF, PNG ou JPEG — max 12 Mo</span>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => void onFile(e)}
          disabled={busy}
        />
      </label>

      {error ? <p className="text-center text-sm text-danger">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          type="button"
          variant="outline"
          className="sm:min-w-[160px]"
          onClick={onSkip}
          disabled={busy}
        >
          Plus tard
        </Button>
      </div>
      {busy ? (
        <p className="text-center text-sm text-text-muted">Envoi en cours…</p>
      ) : null}
    </div>
  );
}
