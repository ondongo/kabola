"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import Logo from "@/components/atoms/Logo";
import { ROUTES, buildLoginHref } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/atoms/Avatar";
import MobileCoinTabBar from "@/components/molecules/MobileCoinTabBar";

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: "Accueil", icon: Icons.home },
  { href: ROUTES.SUBSCRIPTIONS_BROWSE, label: "Explorer", icon: Icons.compass },
  { href: ROUTES.SUBSCRIPTIONS_MINE, label: "Mes abos", icon: Icons.list },
  { href: ROUTES.MESSAGES, label: "Messages", icon: Icons.messageSquare },
  { href: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Icons.bell },
  { href: ROUTES.PROFILE, label: "Profil", icon: Icons.user },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const { user, signOutUser } = useAuth();

  const isCreate = pathname.startsWith("/subscriptions/create");
  const isSubscriptionSubRoute =
    pathname.startsWith("/subscriptions/") && !isCreate;
  const isExploreActive =
    !isCreate &&
    ((pathname === "/subscriptions" && view !== "mine") || isSubscriptionSubRoute);
  const isMineActive =
    !isCreate && pathname === "/subscriptions" && view === "mine";
  const isMessagesActive = pathname.startsWith("/messages");
  const isNotificationsActive = pathname === "/notifications";

  return (
    <>
      <header className="sticky top-0 z-50 hidden items-center justify-between border-b border-border bg-white px-6 py-5 md:flex">
        <Logo size="md" href={ROUTES.DASHBOARD} />
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            let isActive = false;
            if (item.href === ROUTES.DASHBOARD) {
              isActive = pathname === ROUTES.DASHBOARD;
            } else if (item.href === ROUTES.SUBSCRIPTIONS_BROWSE) {
              isActive = isExploreActive;
            } else if (item.href === ROUTES.SUBSCRIPTIONS_MINE) {
              isActive = isMineActive;
            } else if (item.href === ROUTES.MESSAGES) {
              isActive = isMessagesActive;
            } else if (item.href === ROUTES.NOTIFICATIONS) {
              isActive = isNotificationsActive;
            } else {
              isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Avatar src={user.photoURL} alt={user.displayName ?? "Utilisateur"} size="sm" />
              <button
                type="button"
                onClick={() => void signOutUser()}
                className="text-sm font-medium text-text-secondary hover:text-text"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href={buildLoginHref()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Connexion
            </Link>
          )}
        </div>
      </header>

      <MobileCoinTabBar />
    </>
  );
}
