"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/atoms/Card";
import PhoneVerificationStep from "@/app/(dashboard)/subscriptions/create/_components/PhoneVerificationStep";

export default function ProfileVerificationPanel() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
          Vérifier mon téléphone
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Indispensable pour publier un partage public et sécuriser les paiements (SMS).
        </p>
      </div>

      <Card padding="none" className="overflow-hidden shadow-sm ring-1 ring-black/[0.04]">
        <div className="border-b border-border/80 bg-danger-light/40 px-6 py-4">
          <p className="text-sm leading-relaxed text-text">
            <span className="font-semibold text-danger">Important :</span> utilisez un numéro
            joignable — il sert à la confiance entre co-abonnés.
          </p>
        </div>
        <div className="px-6 py-8 md:px-8">
          <PhoneVerificationStep onVerified={() => router.refresh()} />
        </div>
      </Card>
    </div>
  );
}
