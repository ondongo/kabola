import type { Metadata } from "next";
import { Suspense } from "react";
import { FiTrendingUp, FiUsers, FiShield, FiPlus } from "react-icons/fi";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Skeleton from "@/components/atoms/Skeleton";
import { formatPrice } from "@/utils/format";
import { ROUTES, POPULAR_SERVICES } from "@/constants";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Économies mensuelles"
        value={formatPrice(12500)}
        icon={<FiTrendingUp size={20} />}
        color="success"
      />
      <StatCard
        label="Partages actifs"
        value="4"
        icon={<FiUsers size={20} />}
        color="primary"
      />
      <StatCard
        label="Score de confiance"
        value="98"
        icon={<FiShield size={20} />}
        color="warning"
      />
      <StatCard
        label="Total économisé"
        value={formatPrice(150000)}
        icon={<FiTrendingUp size={20} />}
        color="success"
      />
    </div>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link href={ROUTES.CREATE_SUBSCRIPTION}>
        <Card hover padding="md" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
            <FiPlus size={20} />
          </div>
          <div>
            <p className="font-semibold text-text text-sm">Nouveau partage</p>
            <p className="text-xs text-text-muted">Créer un groupe</p>
          </div>
        </Card>
      </Link>
      <Link href={ROUTES.EXPLORE}>
        <Card hover padding="md" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-light text-success">
            <FiUsers size={20} />
          </div>
          <div>
            <p className="font-semibold text-text text-sm">Rejoindre</p>
            <p className="text-xs text-text-muted">Trouver un groupe</p>
          </div>
        </Card>
      </Link>
    </div>
  );
}

function TrendingSubscriptions() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Tendances</h2>
        <Link
          href={ROUTES.EXPLORE}
          className="text-sm font-medium text-primary hover:underline"
        >
          Voir tout
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {POPULAR_SERVICES.slice(0, 4).map((service) => (
          <Card
            key={service.slug}
            hover
            padding="md"
            className="min-w-[160px] shrink-0"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-xl font-bold text-primary">
              {service.name.charAt(0)}
            </div>
            <h3 className="mb-1 text-sm font-semibold text-text truncate">
              {service.name}
            </h3>
            <p className="text-lg font-bold text-primary">
              {formatPrice(service.pricePerSlot)}
            </p>
            <p className="text-xs text-text-muted">/mois</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ActiveShares() {
  const shares = [
    {
      id: "1",
      name: "Netflix Famille",
      members: "4/5",
      nextRenewal: "12 Nov, 2025",
      price: 1950,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Spotify Premium",
      members: "6/6",
      nextRenewal: "18 Nov, 2025",
      price: 1200,
      status: "active" as const,
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Mes partages actifs</h2>
        <Link
          href={ROUTES.MY_SUBSCRIPTIONS}
          className="text-sm font-medium text-primary hover:underline"
        >
          Tout voir
        </Link>
      </div>
      <div className="space-y-3">
        {shares.map((share) => (
          <Card key={share.id} hover padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-base font-bold text-primary">
                  {share.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-text text-sm">
                    {share.name}
                  </h3>
                  <p className="flex items-center gap-2 text-xs text-text-muted">
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
          </Card>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="surface-hero-dark rounded-2xl p-6 text-white">
          <p className="text-sm text-white/70">Bonjour,</p>
          <h1 className="text-2xl font-bold">Rejoindre ou proposer un abo</h1>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-white/80">Économies ce mois</p>
            <p className="ml-auto text-xl font-bold">{formatPrice(12500)}</p>
          </div>
        </div>

        <QuickActions />
        <DashboardStats />
        <TrendingSubscriptions />
        <ActiveShares />

        {/* Trust banner */}
        <Card className="flex items-center gap-3 bg-dark-brand text-white border-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <FiShield size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Identité vérifiée</p>
            <p className="text-xs text-white/70">
              Tous les membres sont vérifiés par Kabola.
            </p>
          </div>
        </Card>
      </div>
    </Suspense>
  );
}
