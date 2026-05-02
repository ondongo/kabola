"use client";

import Link from "next/link";
import Card from "@/components/atoms/Card";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import { formatPrice } from "@/utils/format";
import { ROUTES } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import type { SubscriptionListItem } from "@/types/subscription-list.types";
import { cn } from "@/utils/cn";

type Props = {
  items: SubscriptionListItem[];
};

export default function SubscriptionsMineView({ items }: Props) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text md:text-3xl">
          Mes offres
        </h1>
        <p className="text-sm text-text-secondary">
          Partages que vous hébergez — publics ou privés (lien uniquement).
        </p>
      </header>

      <Link
        href={ROUTES.CREATE_SUBSCRIPTION}
        className="flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-hover"
      >
        <Icons.plus size={18} />
        Nouveau partage
      </Link>

      {items.length === 0 ? (
        <Card className="border-dashed py-16 text-center">
          <p className="text-text-secondary">
            Vous n’avez pas encore créé de partage.
          </p>
          <Link
            href={ROUTES.CREATE_SUBSCRIPTION}
            className="mt-4 inline-block font-semibold text-primary hover:underline"
          >
            Proposer un abonnement
          </Link>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((sub) => {
            const isPrivate = sub.visibility === "private";
            return (
              <li key={sub.id}>
                <Card
                  padding="none"
                  className={cn(
                    "relative overflow-hidden",
                    isPrivate ? "bg-surface ring-1 ring-border" : "bg-white",
                  )}
                >
                  <div className="absolute right-3 top-3 z-10">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        isPrivate
                          ? "bg-gray-200/90 text-text-secondary"
                          : "bg-primary-light text-primary",
                      )}
                    >
                      {isPrivate ? (
                        <Icons.lock size={12} aria-hidden />
                      ) : (
                        <Icons.compass size={12} aria-hidden />
                      )}
                      {isPrivate ? "Privée" : "Public"}
                    </span>
                  </div>

                  <Link
                    href={ROUTES.SUBSCRIPTION_DETAIL(sub.id)}
                    className="flex items-center gap-4 px-4 py-4 pr-24 transition hover:bg-primary-light/20"
                  >
                    <ServiceIcon name={sub.serviceName} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-text">{sub.title}</p>
                      <p className="text-sm text-text-muted">{sub.serviceName}</p>
                      <div className="mt-2 flex items-center gap-0.5">
                        {Array.from({ length: sub.totalSlots }).map((_, i) => (
                          <Icons.users
                            key={i}
                            size={14}
                            className={
                              i < sub.filledSlots ? "text-primary" : "text-gray-300"
                            }
                            aria-hidden
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(sub.pricePerSlotXof)}
                      </p>
                      <p className="text-[10px] text-text-muted">/ place · mois</p>
                      <Icons.chevronRight className="text-text-muted" size={18} aria-hidden />
                    </div>
                  </Link>

                  <div className="flex gap-2 border-t border-border/80 px-4 py-2.5">
                    <Link
                      href={ROUTES.SUBSCRIPTION_MESSAGES(sub.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2 text-xs font-semibold text-text transition hover:bg-surface"
                    >
                      <Icons.messageSquare size={14} aria-hidden />
                      Messages
                    </Link>
                    <Link
                      href={ROUTES.SUBSCRIPTION_DETAIL(sub.id)}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
                    >
                      Détails
                    </Link>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
