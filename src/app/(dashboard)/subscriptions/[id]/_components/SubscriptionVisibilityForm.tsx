"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { Icons } from "@/constants/icons.constants";
import { updateSubscriptionVisibilityAction } from "@/services/subscription.service";
import type { SubscriptionVisibility } from "@/types/common.types";

type Props = {
  subscriptionId: string;
  visibility: SubscriptionVisibility;
};

export default function SubscriptionVisibilityForm({ subscriptionId, visibility }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(visibility);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function change(next: SubscriptionVisibility) {
    if (next === current || busy) return;
    setBusy(true);
    setError(null);
    const r = await updateSubscriptionVisibilityAction({ subscriptionId, visibility: next });
    setBusy(false);
    if (!r.success) {
      setError(typeof r.error === "string" ? r.error : "Impossible de mettre à jour.");
      return;
    }
    setCurrent(next);
    router.refresh();
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void change("public")}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition sm:flex-initial",
            current === "public"
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-text-secondary hover:bg-surface",
          )}
        >
          <Icons.compass size={14} aria-hidden />
          Public (exploration)
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void change("private")}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition sm:flex-initial",
            current === "private"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-border bg-white text-text-secondary hover:bg-surface",
          )}
        >
          <Icons.lock size={14} aria-hidden />
          Privé (lien)
        </button>
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      <p className="text-xs leading-relaxed text-text-muted">
        Le mode public exige un numéro vérifié par SMS. Les co-abonnés voient la fiche selon ce
        réglage.
      </p>
    </div>
  );
}
