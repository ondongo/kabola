"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { ROUTES, buildLoginHref } from "@/constants";
import type { SubscriptionVisibility } from "@/types/common.types";
import { requestParticipation } from "@/services/participation.service";
import Link from "next/link";

export default function SubscriptionJoinActions({
  subscriptionId,
  visibility,
  slotsLeft,
  isLoggedIn,
}: {
  subscriptionId: string;
  visibility: SubscriptionVisibility;
  slotsLeft: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-sm text-text-secondary">Connectez-vous pour rejoindre ce groupe.</p>
        <Link
          href={buildLoginHref(`/subscriptions/${subscriptionId}`)}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white"
        >
          Continuer avec Google
        </Link>
      </Card>
    );
  }

  if (slotsLeft <= 0) {
    return (
      <Card padding="lg" className="text-center text-text-secondary">
        Ce groupe est complet.
      </Card>
    );
  }

  async function onJoin() {
    setPending(true);
    setMessage(null);
    const res = await requestParticipation({
      subscriptionId,
      message: "",
    });
    setPending(false);
    if (res.success) {
      setMessage(
        visibility === "private"
          ? "Demande envoyée. L’hôte doit valider votre accès."
          : "Vous avez rejoint le groupe. Procédez au paiement depuis Paiements.",
      );
      router.refresh();
      return;
    }
    setMessage(typeof res.error === "string" ? res.error : "Impossible de rejoindre.");
  }

  return (
    <Card padding="lg">
      {message ? <p className="mb-4 text-sm text-text-secondary">{message}</p> : null}
      <Button
        type="button"
        className="w-full"
        size="lg"
        isLoading={pending}
        onClick={() => void onJoin()}
      >
        {visibility === "private" ? "Demander à rejoindre" : "Rejoindre le groupe"}
      </Button>
    </Card>
  );
}
