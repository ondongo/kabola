import type { Metadata } from "next";
import { Suspense } from "react";
import { FiSearch, FiInfo } from "react-icons/fi";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import TrustScore from "@/components/atoms/TrustScore";
import Skeleton from "@/components/atoms/Skeleton";
import { formatPrice, getAvailableSlots } from "@/utils/format";
import { SERVICE_CATEGORIES, POPULAR_SERVICES } from "@/constants";

export const metadata: Metadata = {
  title: "Explorer les abonnements",
};

function SearchBar() {
  return (
    <div className="relative">
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        size={20}
      />
      <input
        type="search"
        placeholder="Rechercher un service (ex: Netflix, Spotify...)"
        className="w-full rounded-2xl border border-border bg-white py-3.5 pl-12 pr-4 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function CategoryFilters() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      <button className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
        Tous
      </button>
      {SERVICE_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className="shrink-0 rounded-full bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

function ProTip() {
  return (
    <Card className="flex items-start gap-3 bg-gray-50 border-none">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        <FiInfo size={16} />
      </div>
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-text">Astuce :</span> Rejoindre un
        groupe &quot;Premium&quot; vous donne souvent la qualité 4K pour une
        fraction du prix !
      </p>
    </Card>
  );
}

function SubscriptionList() {
  const subscriptions = POPULAR_SERVICES.map((s, i) => ({
    id: String(i + 1),
    ...s,
    trustScore: 4.5 + Math.random() * 0.5,
    availableSlots: Math.floor(Math.random() * 4) + 1,
    ownerName: ["Marc L.", "Sarah J.", "Alex K.", "Fatou D.", "Moussa N.", "Awa S."][i],
    isVerified: Math.random() > 0.3,
  }));

  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-text">Groupes disponibles</h2>
      {subscriptions.map((sub) => (
        <Card key={sub.id} hover padding="md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-lg font-bold text-primary">
                {sub.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-text truncate">{sub.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-success font-medium">
                    {sub.trustScore.toFixed(1)}
                  </span>
                  {sub.isVerified && (
                    <Badge variant="success">Facture vérifiée</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary">
                {formatPrice(sub.pricePerSlot)}
              </p>
              <p className="text-xs text-text-muted">/mois</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>{sub.availableSlots} place{sub.availableSlots > 1 ? "s" : ""} dispo</span>
              <Badge variant="info">{sub.category}</Badge>
            </div>
            <Button size="sm" variant="secondary">
              Rejoindre
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ExploreSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Explorer</h1>
          <p className="text-sm text-text-secondary">
            Rejoignez un groupe ou proposez votre propre abonnement
          </p>
        </div>

        <SearchBar />
        <CategoryFilters />
        <ProTip />
        <SubscriptionList />

        {/* Safe sharing footer */}
        <Card className="text-center bg-surface border-none py-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-dark-brand text-white">
            <TrustScore score={100} size="sm" />
          </div>
          <h3 className="mb-1 font-semibold text-text">
            Partage 100% sécurisé
          </h3>
          <p className="text-sm text-text-secondary">
            Escrow jusqu&apos;à confirmation de l&apos;accès pour les membres ; les hôtes encadrent
            les paiements en toute transparence. Moins de risques, plus d&apos;économies et de revenus.
          </p>
        </Card>
      </div>
    </Suspense>
  );
}
