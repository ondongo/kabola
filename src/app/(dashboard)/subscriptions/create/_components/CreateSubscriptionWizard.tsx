"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { CurrencyField } from "@/components/atoms/CurrencyField";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import { Icons } from "@/constants/icons.constants";
import {
  POPULAR_SERVICES,
  ROUTES,
  SERVICE_CATEGORIES,
  PLATFORM_FEE_PERCENT,
} from "@/constants";
import {
  createSubscriptionSchema,
  type CreateSubscriptionInput,
} from "@/schemas/subscription.schema";
import { createSubscriptionAction } from "@/services/subscription.service";
import type { ActionResult } from "@/types/common.types";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";
import { ShareSubscriptionModal } from "@/components/molecules/ShareSubscriptionModal";
import InvoiceUploadStep from "./InvoiceUploadStep";
import PhoneVerificationStep from "./PhoneVerificationStep";

const STEPS = [
  "charter",
  "visibility",
  "phone",
  "service",
  "details",
  "seats",
  "pricing",
  "review",
  "invoice",
  "done",
] as const;

type WizardStep = (typeof STEPS)[number];

function stepIndex(s: WizardStep): number {
  return STEPS.indexOf(s);
}

type Props = {
  initialPhoneVerified: boolean;
};

export default function CreateSubscriptionWizard({ initialPhoneVerified }: Props) {
  const router = useRouter();
  const [phoneVerifiedLocal, setPhoneVerifiedLocal] = useState(false);
  const phoneOk = initialPhoneVerified || phoneVerifiedLocal;
  const [step, setStep] = useState<WizardStep>("charter");
  const [charterAccepted, setCharterAccepted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(true);
  const [serviceMode, setServiceMode] = useState<"pick" | "custom" | null>(
    null,
  );

  const form = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema) as Resolver<CreateSubscriptionInput>,
    defaultValues: {
      title: "",
      serviceName: "",
      category: "VIDEO",
      description: "",
      planLabel: "",
      pricePerSlotXof: 2000,
      totalSlots: 4,
      visibility: "public",
      renewalDateIso: "",
    },
  });

  const values = form.watch();
  const totalSlots = values.totalSlots;
  const pricePerSlot = values.pricePerSlotXof;
  const recoveryEstimate = Math.max(0, totalSlots - 1) * pricePerSlot;

  /** Après SMS (parcours public), enchaîner sur le choix du service. */
  useEffect(() => {
    if (step === "phone" && phoneOk) {
      setStep("service");
    }
  }, [step, phoneOk]);

  function goNext() {
    setServerError(null);
    const i = stepIndex(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]!);
  }

  function goBack() {
    setServerError(null);
    if (step === "charter") {
      router.back();
      return;
    }
    if (step === "phone") {
      setStep("visibility");
      return;
    }
    if (step === "visibility") {
      setStep("charter");
      return;
    }
    if (step === "service") {
      const vis = form.getValues("visibility");
      if (vis === "private") {
        setStep("visibility");
      } else if (!phoneOk) {
        setStep("phone");
      } else {
        setStep("visibility");
      }
      return;
    }
    if (step === "details") {
      setStep("service");
      return;
    }
    if (step === "seats") {
      setStep("details");
      return;
    }
    if (step === "pricing") {
      setStep("seats");
      return;
    }
    if (step === "review") {
      setStep("pricing");
      return;
    }
    if (step === "invoice") {
      setStep("review");
      return;
    }
    if (step === "done") {
      setStep("invoice");
      return;
    }
  }

  function applyPopular(slug: string) {
    const pop = POPULAR_SERVICES.find((p) => p.slug === slug);
    if (!pop) return;
    form.setValue("title", `${pop.name} — partage`);
    form.setValue("serviceName", pop.name);
    form.setValue("category", pop.category);
    form.setValue("planLabel", pop.name);
    form.setValue("pricePerSlotXof", pop.pricePerSlot);
    form.setValue("totalSlots", Math.min(Math.max(pop.maxSlots, 2), 20));
  }

  async function submitCreate() {
    setServerError(null);
    const ok = await form.trigger();
    if (!ok) return;
    setCreating(true);
    try {
      const v = form.getValues();
      const fd = new FormData();
      fd.set("title", v.title);
      fd.set("serviceName", v.serviceName);
      fd.set("category", v.category);
      fd.set("description", v.description ?? "");
      fd.set("planLabel", v.planLabel ?? "");
      fd.set("pricePerSlotXof", String(v.pricePerSlotXof));
      fd.set("totalSlots", String(v.totalSlots));
      fd.set("visibility", v.visibility);
      if (v.renewalDateIso?.trim()) fd.set("renewalDateIso", v.renewalDateIso.trim());

      const result: ActionResult<{ id: string }> = await createSubscriptionAction(fd);
      if (!result.success) {
        setServerError(
          typeof result.error === "string" ? result.error : "Vérifiez les champs.",
        );
        return;
      }
      if (result.data?.id) {
        setCreatedId(result.data.id);
        setStep("invoice");
      }
    } finally {
      setCreating(false);
    }
  }

  const shell = (children: React.ReactNode, title: string, subtitle?: string) => (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col px-4 py-6">
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition hover:bg-primary-light/80"
          aria-label="Retour"
        >
          <Icons.arrowLeft size={20} />
        </button>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold leading-tight text-text md:text-[26px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );

  if (step === "charter") {
    return shell(
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-text-secondary">
          Ici on partage bien, on paie juste, et on évite le drama. Un petit coup de
          lecture sur la charte, et tu peux lancer ton groupe (même en mode « invités
          seulement »).
        </p>
        <Link
          href={ROUTES.CHARTER}
          className="inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Lire la charte Kabola →
        </Link>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-primary"
            checked={charterAccepted}
            onChange={(e) => setCharterAccepted(e.target.checked)}
          />
          <span className="text-sm text-text">
            J’ai lu la charte et je m’engage à respecter ces règles.
          </span>
        </label>
        <Button
          type="button"
          size="lg"
          className="w-full rounded-full bg-primary py-4 text-white shadow-md shadow-primary/20 hover:bg-primary-hover"
          disabled={!charterAccepted}
          onClick={() => setStep("visibility")}
        >
          Continuer
        </Button>
      </div>,
      "Proposer un partage",
      "Promis, c’est rapide — et tu peux rester en privé entre potes si tu veux.",
    );
  }

  if (step === "phone" && !phoneOk) {
    return shell(
      <PhoneVerificationStep
        onVerified={() => {
          setPhoneVerifiedLocal(true);
          setStep("visibility");
        }}
      />,
      "Confirmez votre numéro",
      "Un petit SMS pour la première offre publique — on garde la plateforme clean.",
    );
  }

  if (step === "visibility") {
    return shell(
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              form.setValue("visibility", "public");
              setStep(phoneOk ? "service" : "phone");
            }}
            className={cn(
              "flex flex-col items-center rounded-2xl border-2 p-6 text-center transition hover:shadow-md",
              values.visibility === "public"
                ? "border-primary bg-primary-light/40 shadow-sm"
                : "border-border bg-white",
            )}
          >
            <span className="text-3xl" aria-hidden>
              🌍
            </span>
            <span className="mt-3 font-semibold text-text">Partage public</span>
            <span className="mt-2 text-xs text-text-secondary">
              Visible dans l’exploration — idéal pour remplir les places.
              {!phoneOk ? " (SMS requis la 1ère fois.)" : ""}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              form.setValue("visibility", "private");
              setStep("service");
            }}
            className={cn(
              "flex flex-col items-center rounded-2xl border-2 p-6 text-center transition hover:shadow-md",
              values.visibility === "private"
                ? "border-primary bg-primary-light/40 shadow-sm"
                : "border-border bg-white",
            )}
          >
            <span className="text-3xl" aria-hidden>
              🤝
            </span>
            <span className="mt-3 font-semibold text-text">Partage privé</span>
            <span className="mt-2 text-xs text-text-secondary">
              Lien uniquement — parfait entre proches, sans passer par le SMS.
            </span>
          </button>
        </div>
        <p className="text-center text-xs text-text-muted">
          Tu pourras changer d’avis plus tard dans la fiche du groupe.
        </p>
      </div>,
      "Tu veux du monde ou du salon ?",
    );
  }

  if (step === "service") {
    return shell(
      <div className="space-y-2">
        <div className="relative mb-4">
          <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            readOnly
            className="w-full cursor-default rounded-full border border-border py-3 pl-11 pr-4 text-sm text-text-muted"
            placeholder="Rechercher (bientôt)"
          />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Populaires
        </p>
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white">
          {POPULAR_SERVICES.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-surface/60"
                onClick={() => {
                  applyPopular(p.slug);
                  setServiceMode("pick");
                  setStep("details");
                }}
              >
                <ServiceIcon name={p.name} slug={p.slug} size="md" />
                <span className="flex-1 font-medium text-text">{p.name}</span>
                <Icons.chevronRight className="text-text-muted" size={18} />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-4 text-left transition hover:bg-surface"
          onClick={() => {
            setServiceMode("custom");
            setStep("details");
          }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-lg text-primary">
            ✎
          </span>
          <div>
            <p className="font-semibold text-text">Autre abonnement</p>
            <p className="text-xs text-text-muted">Saisie manuelle du service</p>
          </div>
        </button>
      </div>,
      "Proposer",
      "Choisissez un service ou créez un partage personnalisé.",
    );
  }

  if (step === "details") {
    return shell(
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void form.trigger(["title", "serviceName", "category"]).then((ok) => {
            if (ok) setStep("seats");
          });
        }}
      >
        <Input
          label="Titre du groupe"
          placeholder="Ex. Netflix Premium — Dakar"
          {...form.register("title")}
          error={form.formState.errors.title?.message}
        />
        <Input
          label="Service"
          placeholder="Netflix, Spotify…"
          {...form.register("serviceName")}
          error={form.formState.errors.serviceName?.message}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Catégorie</label>
          <select
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            {...form.register("category")}
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Formule / offre"
          placeholder="Ex. Famille, Duo…"
          {...form.register("planLabel")}
          error={form.formState.errors.planLabel?.message}
        />
        <Input
          label="Description (optionnel)"
          {...form.register("description")}
          error={form.formState.errors.description?.message}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-primary py-4 text-white hover:bg-primary-hover shadow-md shadow-primary/15"
        >
          Continuer
        </Button>
      </form>,
      "Détails du partage",
      serviceMode === "custom"
        ? "Décrivez l’offre que vous partagez."
        : "Vérifiez les informations préremplies.",
    );
  }

  if (step === "seats") {
    return shell(
      <div className="space-y-8">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-xl font-medium text-primary hover:bg-primary-light/80"
            onClick={() =>
              form.setValue(
                "totalSlots",
                Math.max(2, (form.getValues("totalSlots") || 2) - 1),
              )
            }
            aria-label="Diminuer"
          >
            −
          </button>
          <span className="min-w-[3rem] text-center text-4xl font-bold tabular-nums text-text">
            {totalSlots}
          </span>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-xl font-medium text-primary hover:bg-primary-light/80"
            onClick={() =>
              form.setValue(
                "totalSlots",
                Math.min(20, (form.getValues("totalSlots") || 2) + 1),
              )
            }
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
        <p className="text-center text-sm text-text-secondary">
          Vous récupérerez environ{" "}
          <span className="font-semibold text-primary">
            {formatPrice(recoveryEstimate)}
          </span>
          <span className="text-text-muted"> par mois</span>
          <span className="block text-xs text-text-muted">
            Estimation en francs CFA (XOF) — places partagées, hors votre place.
          </span>
        </p>
        <div className="rounded-2xl border border-border bg-white px-4 py-4 text-center">
          <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            Facile !
          </span>
          <p className="mt-2 text-xs text-text-secondary">
            Nombre de places disponibles sur votre abonnement, sans vous compter.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full rounded-full bg-primary py-4 text-white hover:bg-primary-hover shadow-md shadow-primary/15"
          onClick={() => setStep("pricing")}
        >
          Continuer
        </Button>
      </div>,
      "Combien de place(s) souhaitez-vous partager ?",
    );
  }

  if (step === "pricing") {
    return shell(
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void form.trigger(["pricePerSlotXof", "renewalDateIso"]).then((ok) => {
            if (ok) setStep("review");
          });
        }}
      >
        <Controller
          name="pricePerSlotXof"
          control={form.control}
          render={({ field }) => (
            <CurrencyField
              id="pricePerSlotXof"
              label="Prix par place (FCFA / mois)"
              value={field.value}
              onValueChange={field.onChange}
              error={form.formState.errors.pricePerSlotXof?.message}
            />
          )}
        />
        <Input
          label="Prochain renouvellement (optionnel)"
          type="datetime-local"
          {...form.register("renewalDateIso")}
          error={form.formState.errors.renewalDateIso?.message}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-primary py-4 text-white hover:bg-primary-hover shadow-md shadow-primary/15"
        >
          Continuer
        </Button>
      </form>,
      "Tarification",
      "Un prix équitable, aligné sur le coût réel de l’abonnement.",
    );
  }

  if (step === "review") {
    return shell(
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <p className="font-semibold text-text">{values.serviceName}</p>
          {values.planLabel ? (
            <p className="text-sm text-text-secondary">{values.planLabel}</p>
          ) : null}
          <p className="text-sm text-text-secondary">
            {values.totalSlots} places ·{" "}
            <span className="font-semibold text-text">
              {formatPrice(values.pricePerSlotXof)}
            </span>{" "}
            par personne et par mois (FCFA)
          </p>
        </div>
        <div className="rounded-2xl bg-primary-light/50 px-4 py-4 text-center text-sm ring-1 ring-primary/10">
          <p className="text-text-secondary">
            Commission plateforme :{" "}
            <span className="font-semibold text-primary">{PLATFORM_FEE_PERCENT}%</span>{" "}
            sur les paiements traités via Kabola.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Pour couvrir l’escrow, PayDunya et la modération.
          </p>
        </div>
        {serverError ? (
          <p className="text-center text-sm text-danger">{serverError}</p>
        ) : null}
        <Button
          type="button"
          size="lg"
          className="w-full rounded-full bg-primary py-4 text-white hover:bg-primary-hover shadow-md shadow-primary/15"
          isLoading={creating}
          onClick={() => void submitCreate()}
        >
          Publier le partage
        </Button>
      </div>,
      "Tout est prêt !",
      "Vous pouvez maintenant publier votre annonce.",
    );
  }

  if (step === "invoice" && createdId) {
    return shell(
      <InvoiceUploadStep
        subscriptionId={createdId}
        onSkip={() => setStep("done")}
        onComplete={() => setStep("done")}
      />,
      "Ajouter une facture",
      "Facultatif mais recommandé pour la confiance.",
    );
  }

  if (step === "done" && createdId) {
    const shareTitle = values.serviceName?.trim() || values.title || "Mon partage";
    return (
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col px-4 py-10 text-center">
        <ShareSubscriptionModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          shareTitle={shareTitle}
          subscriptionId={createdId}
        />

        {!shareModalOpen ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-3xl text-primary">
              ✓
            </div>
            <h1 className="mt-6 text-2xl font-bold text-text">C’est en ligne !</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Votre partage est publié. Les co-abonnés peuvent vous écrire dans Messages.
            </p>
            <div className="mt-10 flex flex-col gap-3">
              <Link
                href={ROUTES.SUBSCRIPTION_DETAIL(createdId)}
                className="inline-flex items-center justify-center rounded-full bg-primary py-4 text-sm font-semibold text-white shadow-md shadow-primary/15 hover:bg-primary-hover"
              >
                Voir mon annonce
              </Link>
              <Link
                href={ROUTES.SUBSCRIPTION_MESSAGES(createdId)}
                className="inline-flex items-center justify-center rounded-full border-2 border-primary/30 py-4 text-sm font-semibold text-primary hover:bg-primary-light/50"
              >
                Ouvrir les messages
              </Link>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-text-muted">
            Partagez votre lien pour inviter des co-abonnés — fermez la fenêtre pour continuer.
          </p>
        )}
      </div>
    );
  }

  return null;
}
