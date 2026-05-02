"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import { formatPrice } from "@/utils/format";
import { ROUTES, SERVICE_CATEGORIES } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import { CATEGORY_CHIP_STYLES } from "@/constants/category-ui.constants";
import type { SubscriptionListItem } from "@/types/subscription-list.types";
import { cn } from "@/utils/cn";
import { loadMorePublicSubscriptionsAction } from "@/services/subscription.service";

type Props = {
  initialItems: SubscriptionListItem[];
  initialNextCursor: string | null;
  /** Préremplissage depuis l’URL (?q=…) */
  initialQuery?: string;
  /** Préremplissage depuis l’URL (?category=VIDEO) */
  initialCategory?: string;
};

const ALL_ID = "ALL" as const;

function isValidCategoryId(id: string | undefined): id is string {
  if (!id || id === ALL_ID) return false;
  return SERVICE_CATEGORIES.some((c) => c.id === id);
}

export default function SubscriptionsExploreClient({
  initialItems,
  initialNextCursor,
  initialQuery = "",
  initialCategory,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState<string>(
    isValidCategoryId(initialCategory) ? initialCategory : ALL_ID,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => {
      const catOk =
        categoryId === ALL_ID ? true : s.category === categoryId;
      if (!catOk) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.serviceName.toLowerCase().includes(q)
      );
    });
  }, [items, query, categoryId]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const result = await loadMorePublicSubscriptionsAction(nextCursor);
    setLoadingMore(false);
    if (result.success && result.data) {
      setItems((prev) => [...prev, ...result.data.items]);
      setNextCursor(result.data.nextCursor);
    }
  }

  const chips = [
    { id: ALL_ID, label: "Tous" },
    ...SERVICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <header className="space-y-1 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
          Explorer
        </h1>
        <p className="text-sm text-text-secondary">
          Groupes publics — rejoignez une place ou proposez votre partage.
        </p>
      </header>

      <div className="relative mx-auto max-w-xl">
        <Icons.search
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
          size={20}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher"
          className="w-full rounded-full border border-border/80 bg-white py-3.5 pl-12 pr-5 text-base text-text shadow-sm outline-none ring-0 transition placeholder:text-text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
        {chips.map((c) => {
          const styles =
            CATEGORY_CHIP_STYLES[c.id] ?? CATEGORY_CHIP_STYLES.OTHER;
          const active = categoryId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                active ? styles.active : styles.inactive,
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <Card className="flex items-start gap-3 border border-border/60 bg-surface/50 shadow-none">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
          <Icons.info size={18} />
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          <span className="font-semibold text-text">Astuce :</span> vérifiez le badge
          facture et le profil avant de payer.
        </p>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          Groupes disponibles ({filtered.length})
        </h2>
        {filtered.length === 0 ? (
          <Card className="border-dashed py-14 text-center">
            <p className="text-text-secondary">
              Aucun résultat. Essayez un autre mot-clé ou une catégorie.
            </p>
            <Link
              href={ROUTES.CREATE_SUBSCRIPTION}
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Proposer un partage
            </Link>
          </Card>
        ) : (
          <ul className="space-y-2">
            {filtered.map((sub) => (
              <li key={sub.id}>
                <Card hover padding="none" className="overflow-hidden">
                  <Link
                    href={ROUTES.SUBSCRIPTION_DETAIL(sub.id)}
                    className="flex items-center gap-4 px-4 py-4 transition hover:bg-surface/60"
                  >
                    <ServiceIcon name={sub.serviceName} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">
                        {sub.title}
                      </p>
                      <p className="truncate text-sm text-text-muted">
                        {sub.serviceName}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {sub.invoiceVerificationStatus === "auto_verified" ||
                        sub.invoiceVerificationStatus === "manually_verified" ? (
                          <Badge variant="success">Facture vérifiée</Badge>
                        ) : null}
                        <Badge variant="info">{sub.category}</Badge>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(sub.pricePerSlotXof)}
                      </p>
                      <p className="text-xs text-text-muted">/ mois</p>
                    </div>
                    <Icons.chevronRight
                      className="hidden shrink-0 text-text-muted sm:block"
                      size={20}
                    />
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
        {nextCursor ? (
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-6"
              isLoading={loadingMore}
              disabled={loadingMore}
              onClick={() => void loadMore()}
            >
              Charger plus de groupes
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
