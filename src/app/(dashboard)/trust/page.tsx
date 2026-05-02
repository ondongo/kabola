import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Card from "@/components/atoms/Card";
import { getSessionUid } from "@/lib/auth/session";
import { getTrustEventsForCurrentUser } from "@/services/trust.service";
import { trustLabelForScore } from "@/utils/trust.utils";
import { getUserProfileByUid } from "@/services/user.service";
import { buildLoginHref } from "@/constants";

export const metadata: Metadata = {
  title: "Confiance",
};

export default async function TrustPage() {
  const uid = await getSessionUid();
  if (!uid) redirect(buildLoginHref());

  const [profile, events] = await Promise.all([
    getUserProfileByUid(uid),
    getTrustEventsForCurrentUser(),
  ]);

  const score = profile?.trustScore ?? 50;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Confiance Kabola</h1>
        <p className="text-sm text-text-secondary">
          Score basé sur vos paiements, vérifications de factures et comportement sur la
          plateforme.
        </p>
      </div>

      <Card padding="lg" className="bg-dark-brand text-white">
        <p className="text-sm text-white/70">Votre score</p>
        <p className="text-4xl font-bold">{score}</p>
        <p className="text-sm text-white/80">{trustLabelForScore(score)}</p>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-bold text-text">Historique</h2>
        <div className="space-y-2">
          {events.length === 0 ? (
            <Card className="text-sm text-text-secondary">Aucun événement pour le moment.</Card>
          ) : (
            events.map((row) => {
              const e = row as Record<string, unknown> & { id: string };
              return (
              <Card key={String(e.id)} padding="sm">
                <p className="text-sm font-medium text-text">{String(e.reason ?? "")}</p>
                <p className="text-xs text-text-muted">
                  {String(e.type ?? "")} · {e.delta != null ? `+${String(e.delta)}` : ""}
                </p>
              </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
