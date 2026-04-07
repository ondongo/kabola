import type { Metadata } from "next";
import { Suspense } from "react";
import { FiFilter, FiUsers, FiCalendar, FiPlus, FiInfo } from "react-icons/fi";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Skeleton from "@/components/atoms/Skeleton";
import { formatPrice, formatShortDate } from "@/utils/format";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Mes abonnements",
};

function SubscriptionStats() {
  return (
    <Card className="bg-surface border-none">
      <div className="grid grid-cols-3 divide-x divide-border text-center">
        <div className="py-2">
          <p className="text-lg font-bold text-success">
            {formatPrice(12500)}
          </p>
          <p className="text-xs text-text-muted">Économies/mois</p>
        </div>
        <div className="py-2">
          <p className="text-lg font-bold text-primary">4</p>
          <p className="text-xs text-text-muted">Partages actifs</p>
        </div>
        <div className="py-2">
          <p className="text-lg font-bold text-warning">98</p>
          <p className="text-xs text-text-muted">Score confiance</p>
        </div>
      </div>
    </Card>
  );
}

function ActiveSharesList() {
  const shares = [
    {
      id: "1",
      name: "Netflix Famille",
      members: "4/5",
      nextRenewal: new Date("2025-11-12"),
      price: 1950,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Spotify Premium",
      members: "6/6",
      nextRenewal: new Date("2025-11-18"),
      price: 1200,
      status: "active" as const,
    },
    {
      id: "3",
      name: "Apple Music",
      members: "3/5",
      nextRenewal: new Date("2025-12-02"),
      price: 2000,
      status: "active" as const,
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-text">Partages actifs</h2>
        <button className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <FiFilter size={14} />
          Filtrer
        </button>
      </div>
      <div className="space-y-3">
        {shares.map((share) => (
          <Link key={share.id} href={ROUTES.SUBSCRIPTION_DETAIL(share.id)}>
            <Card hover padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-lg font-bold text-primary">
                    {share.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{share.name}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-text-muted">
                      <FiUsers size={12} /> {share.members}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="success">Actif</Badge>
                  <p className="mt-1 text-sm font-bold text-text">
                    {formatPrice(share.price)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} />
                  Prochain renouvellement
                </span>
                <span>{formatShortDate(share.nextRenewal)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AttentionRequired() {
  return (
    <div>
      <h2 className="mb-3 text-base font-bold text-text">Attention requise</h2>
      <Card className="border-warning/30 bg-warning-light/30" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-lg font-bold text-primary">
              I
            </div>
            <div>
              <h3 className="font-semibold text-text">IPTV</h3>
              <p className="flex items-center gap-1.5 text-xs text-text-muted">
                <FiUsers size={12} /> 2/4
              </p>
            </div>
          </div>
          <Badge variant="warning">Expire bientôt</Badge>
        </div>
      </Card>
    </div>
  );
}

function MySubsSkeleton() {
  return (
    <div className="space-y-5 px-4 py-6">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-20 rounded-2xl" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export default function MySubscriptionsPage() {
  return (
    <Suspense fallback={<MySubsSkeleton />}>
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        {/* Header */}
        <div className="surface-hero-dark rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-lg">
              K
            </div>
            <div>
              <h1 className="text-lg font-bold">Mes abonnements</h1>
              <p className="text-sm text-white/70">
                12 500 FCFA économisés cette semaine — proposez aussi vos abonnements pour rentabiliser chaque place.
              </p>
            </div>
          </div>
        </div>

        <SubscriptionStats />
        <ActiveSharesList />
        <AttentionRequired />

        {/* Pro tip */}
        <Card className="flex items-center gap-3 bg-gray-50 border-none">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
            <FiInfo size={20} />
          </div>
          <p className="text-sm text-text-secondary">
            Ajoutez un moyen de paiement de secours pour vos partages. Si vous êtes hôte, c&apos;est aussi
            utile pour recevoir les contributions sans accroc.
          </p>
        </Card>

        {/* Browse more */}
        <Link href={ROUTES.EXPLORE} className="block">
          <Button className="w-full" size="lg" icon={<FiPlus size={18} />}>
            Explorer ou publier un abonnement
          </Button>
        </Link>
      </div>
    </Suspense>
  );
}
