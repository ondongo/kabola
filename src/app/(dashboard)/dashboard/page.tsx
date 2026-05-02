import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import Skeleton from "@/components/atoms/Skeleton";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import { formatPrice } from "@/utils/format";
import { ROUTES, POPULAR_SERVICES, Icons } from "@/constants";
import { getSessionUid } from "@/lib/auth/session";
import { listSubscriptionsForOwner } from "@/services/subscription.service";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

function DashboardStats({ activeShareCount }: { activeShareCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Économies mensuelles"
        value={formatPrice(12500)}
        icon={<Icons.trendingUp size={20} />}
        color="success"
      />
      <StatCard
        label="Partages actifs"
        value={String(activeShareCount)}
        icon={<Icons.users size={20} />}
        color="primary"
      />
      <StatCard
        label="Score de confiance"
        value="98"
        icon={<Icons.shield size={20} />}
        color="warning"
      />
      <StatCard
        label="Total économisé"
        value={formatPrice(150000)}
        icon={<Icons.trendingUp size={20} />}
        color="success"
      />
    </div>
  );
}

function DashboardActionCards() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Link href={ROUTES.CREATE_SUBSCRIPTION} className="group block">
          <div className="relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl bg-linear-to-b from-amber-200 via-orange-400 to-orange-600 p-5 shadow-lg ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-xl">
            <h2 className="text-xl font-bold leading-tight text-neutral-900">
              Proposer{" "}
              <span className="text-white drop-shadow-sm">un abonnement</span>
            </h2>
            <div className="relative mt-2 min-h-[120px] flex-1">
              <Image
                src="/images/suggest-kabola-1.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-bottom"
                priority
              />
            </div>
            <div className="mt-auto flex justify-center pt-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-md transition group-hover:bg-white/95">
                Proposer
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Icons.plus size={16} strokeWidth={2.5} />
                </span>
              </span>
            </div>
          </div>
        </Link>

        <Link href={ROUTES.SUBSCRIPTIONS_BROWSE} className="group block">
          <div className="relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl bg-linear-to-b from-pink-200 via-fuchsia-500 to-rose-700 p-5 shadow-lg ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-xl">
            <h2 className="text-xl font-bold leading-tight text-neutral-900">
              Rejoindre{" "}
              <span className="text-white drop-shadow-sm">un abonnement</span>
            </h2>
            <div className="relative mt-2 min-h-[120px] flex-1">
              <Image
                src="/images/join-kabola-1.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-bottom"
              />
            </div>
            <div className="mt-auto flex justify-center pt-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-md transition group-hover:bg-white/95">
                Rejoindre
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Icons.search size={16} strokeWidth={2.5} />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </div>

      <Link href={ROUTES.SUBSCRIPTIONS_BROWSE} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-emerald-950 via-teal-700 to-teal-400 p-5 shadow-lg ring-1 ring-white/10 md:p-6">
          <div className="grid items-end gap-4 md:grid-cols-2 md:items-center">
            <div className="text-white">
              <p className="text-2xl font-bold tracking-tight">Kabola+</p>
              <p className="mt-1 text-sm text-white/85">
                Tout Kabola sans frais, et bien plus encore…
              </p>
              <span className="mt-4 inline-flex w-full max-w-xs items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-md transition group-hover:bg-white/95 md:w-auto">
                Découvrir Kabola+
              </span>
            </div>
            <div className="relative mx-auto h-44 w-full max-w-sm md:mx-0 md:ml-auto md:h-52">
              <Image
                src="/images/woman-kabola-1.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function PopularPlatformsStrip() {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Plateformes populaires
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {POPULAR_SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={`${ROUTES.SUBSCRIPTIONS_BROWSE}?q=${encodeURIComponent(service.name)}`}
            className="transition hover:opacity-90"
            title={service.name}
          >
            <ServiceIcon
              name={service.name}
              slug={service.slug}
              size="lg"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrendingSubscriptions() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Tendances</h2>
        <Link
          href={ROUTES.SUBSCRIPTIONS_BROWSE}
          className="text-sm font-medium text-primary hover:underline"
        >
          Voir tout
        </Link>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {POPULAR_SERVICES.slice(0, 4).map((service) => (
          <Link
            key={service.slug}
            href={`${ROUTES.SUBSCRIPTIONS_BROWSE}?q=${encodeURIComponent(service.name)}`}
            className="min-w-[160px] shrink-0"
          >
            <Card hover padding="md" className="h-full transition hover:ring-2 hover:ring-primary/20">
              <div className="mb-3">
                <ServiceIcon
                  name={service.name}
                  slug={service.slug}
                  size="lg"
                />
              </div>
              <h3 className="mb-1 truncate text-sm font-semibold text-text">
                {service.name}
              </h3>
              <p className="text-lg font-bold text-primary">
                {formatPrice(service.pricePerSlot)}
              </p>
              <p className="text-xs text-text-muted">/mois</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

type ActiveShareRow = {
  id: string;
  title: string;
  serviceName: string;
  filledSlots: number;
  totalSlots: number;
  pricePerSlotXof: number;
};

function ActiveShares({ items }: { items: ActiveShareRow[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Mes partages actifs</h2>
        <Link
          href={ROUTES.SUBSCRIPTIONS_MINE}
          className="text-sm font-medium text-primary hover:underline"
        >
          Tout voir
        </Link>
      </div>
      {items.length === 0 ? (
        <Card className="border-dashed py-10 text-center">
          <p className="text-sm text-text-secondary">
            Aucun partage actif pour le moment.
          </p>
          <Link
            href={ROUTES.CREATE_SUBSCRIPTION}
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Proposer un abonnement
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((share) => (
            <Link key={share.id} href={ROUTES.SUBSCRIPTION_DETAIL(share.id)} className="block">
              <Card hover padding="md" className="transition hover:ring-2 hover:ring-primary/15">
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <ServiceIcon name={share.serviceName} size="md" />
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-text">{share.title}</h3>
                      <p className="flex items-center gap-2 text-xs text-text-muted">
                        <Icons.users size={12} aria-hidden />
                        {share.filledSlots}/{share.totalSlots}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge variant="success">Actif</Badge>
                    <p className="mt-1 text-sm font-bold text-text">
                      {formatPrice(share.pricePerSlotXof)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
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

export default async function DashboardPage() {
  const uid = await getSessionUid();
  const mine = uid ? await listSubscriptionsForOwner(uid) : [];
  const activeShares: ActiveShareRow[] = mine
    .filter((s) => s.status === "active")
    .slice(0, 6)
    .map((s) => ({
      id: s.id,
      title: s.title,
      serviceName: s.serviceName,
      filledSlots: s.filledSlots,
      totalSlots: s.totalSlots,
      pricePerSlotXof: s.pricePerSlotXof,
    }));

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div className="surface-hero-dark rounded-2xl p-6 text-white">
          <p className="text-sm text-white/70">Bonjour,</p>
          <h1 className="text-2xl font-bold">Rejoindre ou proposer un abo</h1>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm text-white/80">Économies ce mois</p>
            <p className="ml-auto text-xl font-bold">{formatPrice(12500)}</p>
          </div>
        </div>

        <DashboardActionCards />
        <PopularPlatformsStrip />
        <DashboardStats activeShareCount={activeShares.length} />
        <TrendingSubscriptions />
        <ActiveShares items={activeShares} />

        <Card className="flex items-center gap-3 border-none bg-dark-brand text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Icons.shield size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Identité vérifiée</p>
            <p className="text-xs text-white/70">
              Les paiements passent par PayDunya ; l’escrow protège jusqu’à validation de
              l’accès.
            </p>
          </div>
          <Link
            href={ROUTES.TRUST}
            className="ml-auto inline-flex shrink-0 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Confiance
          </Link>
        </Card>
      </div>
    </Suspense>
  );
}
