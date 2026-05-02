import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/atoms/Card";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import { formatPrice } from "@/utils/format";
import { ROUTES } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import { getSubscriptionById } from "@/services/subscription.service";
import { getSessionUid } from "@/lib/auth/session";
import { userCanAccessSubscriptionMessages } from "@/services/messaging.service";
import SubscriptionJoinActions from "./_components/SubscriptionJoinActions";
import SubscriptionVisibilityForm from "./_components/SubscriptionVisibilityForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sub = await getSubscriptionById(id);
  return { title: sub?.title ?? "Abonnement" };
}

export default async function SubscriptionDetailPage({ params }: Props) {
  const { id } = await params;
  const sub = await getSubscriptionById(id);
  if (!sub) notFound();

  const uid = await getSessionUid();
  const isOwner = uid === sub.ownerId;
  const slotsLeft = sub.totalSlots - sub.filledSlots;
  const canMessage =
    uid != null && (await userCanAccessSubscriptionMessages(id, uid));
  const isPrivate = sub.visibility === "private";

  const createdLabel = sub.createdAt?.toDate
    ? sub.createdAt.toDate().toLocaleDateString("fr-FR")
    : "—";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary-light/40 pb-10">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href={ROUTES.SUBSCRIPTIONS_BROWSE}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border/80"
            aria-label="Retour"
          >
            <Icons.arrowLeft size={20} />
          </Link>
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-text">
            <ServiceIcon name={sub.serviceName} size="sm" />
            <span className="truncate">{sub.serviceName}</span>
          </div>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-text-muted ring-1 ring-border/60"
            title="Partage (bientôt)"
            aria-hidden
          >
            <Icons.users size={18} />
          </span>
        </div>

        {canMessage ? (
          <Link
            href={ROUTES.SUBSCRIPTION_MESSAGES(id)}
            className="mb-4 flex items-center justify-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:bg-white"
          >
            <Icons.messageSquare size={18} />
            Messages
          </Link>
        ) : null}

        <Card padding="none" className="overflow-hidden shadow-lg ring-1 ring-black/5">
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div>
                <p className="text-sm font-bold text-text">Participation</p>
                <p className="mt-1 text-2xl font-bold text-text">
                  {formatPrice(sub.pricePerSlotXof)}
                  <span className="text-base font-medium text-text-muted"> / mois</span>
                </p>
              </div>
              <Icons.chevronRight className="shrink-0 text-text-muted" size={18} aria-hidden />
            </div>
            <div className="flex items-start justify-between gap-3 px-4 py-4">
              <div>
                <p className="text-sm font-bold text-text">Co-abonnés</p>
                <div className="mt-2 flex -space-x-2">
                  {Array.from({ length: sub.totalSlots }).map((_, i) => (
                    <span
                      key={i}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-gray-500"
                    >
                      <Icons.users size={14} aria-hidden />
                    </span>
                  ))}
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
                {sub.filledSlots}/{sub.totalSlots}
              </span>
            </div>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-text">Visibilité</p>
                {!isOwner ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      isPrivate ? "bg-neutral-900 text-white" : "bg-primary text-white"
                    }`}
                  >
                    {isPrivate ? <Icons.lock size={12} aria-hidden /> : <Icons.compass size={12} aria-hidden />}
                    {isPrivate ? "Privée" : "Publique"}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {isPrivate
                  ? "Mode privé : votre annonce n’est pas visible dans l’exploration Kabola. Partagez le lien avec vos proches."
                  : "Visible dans l’exploration Kabola pour que d’autres utilisateurs puissent vous rejoindre."}
              </p>
              {isOwner ? (
                <SubscriptionVisibilityForm subscriptionId={sub.id} visibility={sub.visibility} />
              ) : null}
            </div>
          </div>
        </Card>

        <Card padding="none" className="mt-4 divide-y divide-border shadow-sm">
          <div className="px-4 py-4">
            <p className="text-sm font-bold text-text">Détails</p>
            <p className="mt-1 text-sm text-text">
              {sub.serviceName}
              {sub.planLabel ? (
                <>
                  {" "}
                  : <span className="font-semibold">{sub.planLabel}</span>
                </>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {isOwner ? "Propriétaire" : "Groupe"} depuis le {createdLabel}
            </p>
          </div>
          <Link
            href={ROUTES.CHARTER}
            className="flex items-center gap-3 px-4 py-4 transition hover:bg-surface"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text">Charte Kabola</p>
              <p className="text-sm text-primary">Lire la charte de confiance</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary">
              ✓ Charte
            </span>
            <Icons.chevronRight className="shrink-0 text-text-muted" size={18} aria-hidden />
          </Link>
          {isOwner ? (
            <div className="px-4 py-4">
              <p className="text-sm font-bold text-text">Arrêter le partage</p>
              <p className="mt-1 text-xs text-text-secondary">
                Supprimera les accès liés à ce groupe sur Kabola (bientôt disponible).
              </p>
            </div>
          ) : null}
        </Card>

        {sub.description ? (
          <Card className="mt-4" padding="md">
            <p className="text-sm text-text-secondary">{sub.description}</p>
          </Card>
        ) : null}

        <div className="mt-6">
          {!isOwner ? (
            <SubscriptionJoinActions
              subscriptionId={sub.id}
              visibility={sub.visibility}
              slotsLeft={slotsLeft}
              isLoggedIn={Boolean(uid)}
            />
          ) : (
            <Card className="bg-primary-light text-sm text-primary">
              Vous êtes l’hôte de ce groupe. Les demandes arrivent sur cette fiche et dans
              Messages.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
