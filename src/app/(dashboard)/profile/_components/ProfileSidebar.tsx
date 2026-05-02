"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import Avatar from "@/components/atoms/Avatar";
import ProfileSignOutButton from "./ProfileSignOutButton";

const ACCOUNT_LINKS: { href: string; label: string; icon: typeof Icons.user }[] = [
  { href: ROUTES.PROFILE, label: "Informations personnelles", icon: Icons.user },
  { href: ROUTES.PROFILE_VERIFICATION, label: "Vérifier mon téléphone", icon: Icons.phone },
];

const OTHER_LINKS: { href: string; label: string; icon: typeof Icons.user }[] = [
  { href: ROUTES.PAYMENTS, label: "Moyens de paiement", icon: Icons.dollarSign },
  { href: ROUTES.TRUST, label: "Confiance", icon: Icons.shield },
];

type Props = {
  displayName: string | null;
  photoURL: string | null;
  trustScore: number;
  memberSinceLabel: string;
};

type NavItem = (typeof ACCOUNT_LINKS)[number];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
        active
          ? "bg-white font-semibold text-text shadow-sm ring-1 ring-border"
          : "text-text-secondary hover:bg-white/70",
      )}
    >
      <item.icon size={18} className="shrink-0 opacity-70" aria-hidden />
      <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
      <Icons.chevronRight className="shrink-0 opacity-40" size={16} aria-hidden />
    </Link>
  );
}

export default function ProfileSidebar({
  displayName,
  photoURL,
  trustScore: score,
  memberSinceLabel,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:sticky md:top-24 md:max-w-[280px] md:self-start">
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar src={photoURL} alt={displayName ?? "Profil"} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-text">{displayName ?? "Utilisateur"}</p>
            <p className="text-xs text-text-muted">{memberSinceLabel}</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-surface px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Indice de confiance
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs tabular-nums text-text-secondary">
            <span className="font-semibold text-text">{score}</span>
            /100
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border/80 bg-white p-2 shadow-sm">
        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Mon compte
        </p>
        <div className="space-y-0.5">
          {ACCOUNT_LINKS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={
                item.href === ROUTES.PROFILE
                  ? pathname === ROUTES.PROFILE
                  : pathname === item.href
              }
            />
          ))}
        </div>

        <p className="mt-3 border-t border-border/60 px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Paiements & confiance
        </p>
        <div className="space-y-0.5">
          {OTHER_LINKS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-linear-to-br from-primary to-primary-hover p-4 text-center shadow-sm">
        <p className="text-sm font-bold text-white">Kabola</p>
        <p className="mt-0.5 text-xs text-white/90">Partagez mieux, payez moins.</p>
      </div>

      <div className="mt-6 space-y-3">
        <ProfileSignOutButton />
      </div>
    </aside>
  );
}
