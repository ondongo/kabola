"use client";

import { useCallback, useMemo, useState } from "react";
import { SimpleModal } from "@/components/molecules/SimpleModal";
import { Icons } from "@/constants/icons.constants";
import { ROUTES } from "@/constants";
import { cn } from "@/utils/cn";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** Titre affiché en en-tête (ex. nom du service partagé) */
  shareTitle: string;
  subscriptionId: string;
};

function shareUrl(subscriptionId: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${ROUTES.SUBSCRIPTION_DETAIL(subscriptionId)}`;
  }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base.replace(/\/$/, "")}${ROUTES.SUBSCRIPTION_DETAIL(subscriptionId)}`;
}

function SocialButton({
  className,
  href,
  icon,
  label,
}: {
  className: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95",
        className,
      )}
    >
      {icon}
      {label}
    </a>
  );
}

export function ShareSubscriptionModal({
  isOpen,
  onClose,
  shareTitle,
  subscriptionId,
}: Props) {
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => shareUrl(subscriptionId), [subscriptionId]);

  const encoded = encodeURIComponent(url);
  const textEncoded = encodeURIComponent(
    `Rejoins mon groupe sur Kabola : ${shareTitle}`,
  );

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [url]);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Partager · ${shareTitle}`}
      description="Invitez des co-abonnés avec le lien ou le QR code."
      className="w-[min(100vw-2rem,400px)]"
      compact
    >
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-2xl border border-border bg-white p-3 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="" width={200} height={200} className="rounded-lg" />
        </div>

        <button
          type="button"
          onClick={() => void onCopy()}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-white py-3.5 text-sm font-semibold text-text transition hover:bg-surface"
        >
          <Icons.fileText size={18} aria-hidden />
          {copied ? "Copié !" : "Copier le lien"}
        </button>

        <div className="flex w-full flex-col gap-2.5">
          <SocialButton
            className="bg-[#1877F2]"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
            icon={<span className="text-lg font-bold">f</span>}
            label="Partager sur Facebook"
          />
          <SocialButton
            className="bg-[#25D366]"
            href={`https://wa.me/?text=${textEncoded}%20${encoded}`}
            icon={<Icons.smartphone size={18} aria-hidden />}
            label="Partager sur WhatsApp"
          />
          <SocialButton
            className="bg-neutral-900"
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${textEncoded}`}
            icon={<span className="text-sm font-bold">𝕏</span>}
            label="Partager sur X"
          />
          <a
            href={`mailto:?subject=${encodeURIComponent(`Invitation Kabola — ${shareTitle}`)}&body=${textEncoded}%0A%0A${encoded}`}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-white py-3.5 text-sm font-semibold text-text transition hover:bg-surface"
          >
            <Icons.mail size={18} aria-hidden />
            Partager par e-mail
          </a>
        </div>
      </div>
    </SimpleModal>
  );
}
