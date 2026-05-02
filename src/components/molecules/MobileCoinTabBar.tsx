"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants";
import { Icons } from "@/constants/icons.constants";

type TabItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  isCreate?: boolean;
};

const TABS: TabItem[] = [
  { href: ROUTES.DASHBOARD, label: "Accueil", icon: Icons.home },
  { href: ROUTES.SUBSCRIPTIONS_BROWSE, label: "Explorer", icon: Icons.compass },
  { href: ROUTES.SUBSCRIPTIONS_MINE, label: "Mes abos", icon: Icons.list },
  { href: ROUTES.CREATE_SUBSCRIPTION, label: "Créer", icon: Icons.plus, isCreate: true },
  { href: ROUTES.MESSAGES, label: "Messages", icon: Icons.messageSquare },
  { href: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Icons.bell },
  { href: ROUTES.PROFILE, label: "Profil", icon: Icons.user },
];

function getActiveTabIndex(pathname: string, view: string | null): number {
  if (pathname.startsWith("/subscriptions/create")) return 3;
  if (pathname === ROUTES.DASHBOARD) return 0;
  const isCreatePath = pathname.startsWith("/subscriptions/create");
  const isSubscriptionDetail =
    pathname.startsWith("/subscriptions/") && !isCreatePath;
  if (pathname === "/subscriptions" && view !== "mine") return 1;
  if (pathname === "/subscriptions" && view === "mine") return 2;
  if (isSubscriptionDetail) return 1;
  if (pathname.startsWith("/messages")) return 4;
  if (pathname === "/notifications") return 5;
  if (pathname === ROUTES.PROFILE || pathname.startsWith(`${ROUTES.PROFILE}/`))
    return 6;
  return 0;
}

const SLOT_PCT = 100 / TABS.length;

/**
 * La « boule blanche » (anneau) glisse sous l’onglet actif ; le FAB vert + n’apparaît que sur Créer.
 */
export default function MobileCoinTabBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const reduceMotion = useReducedMotion();

  const activeIndex = getActiveTabIndex(pathname, view);
  const createActive = activeIndex === 3;

  const spring = reduceMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 32, mass: 0.88 };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Navigation principale"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-black/4 to-transparent" />

      <div className="relative mx-auto max-w-lg px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div
          className={cn(
            "relative overflow-visible rounded-t-[1.75rem] border border-border/70 bg-white/95 px-0.5 pb-2 pt-2 shadow-[0_-12px_40px_rgba(6,78,59,0.12)] backdrop-blur-md supports-backdrop-filter:bg-white/85",
            createActive && "pt-4",
          )}
        >
          {/* Boule blanche (+ FAB vert sur Créer) — se déplace avec l’onglet actif */}
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-0 flex items-end justify-center"
            style={{ width: `${SLOT_PCT}%` }}
            initial={false}
            animate={{
              x: `${activeIndex * 100}%`,
            }}
            transition={spring}
          >
            <div className="relative flex w-full flex-col items-center justify-end pb-2">
              <motion.div
                initial={false}
                animate={{
                  y: createActive ? -34 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 28,
                }}
                className={cn(
                  "flex items-center justify-center rounded-full shadow-lg",
                  createActive
                    ? "h-15 w-15 bg-linear-to-br from-primary via-primary to-primary-hover text-white ring-[6px] ring-white"
                    : "h-11 w-11 bg-white ring-[5px] ring-white shadow-primary/10",
                )}
              >
                {createActive ? (
                  <Icons.plus size={28} strokeWidth={2.5} className="text-white" />
                ) : null}
              </motion.div>
            </div>
          </motion.div>

          <div className="relative z-10 flex min-h-[4.5rem] items-end">
            {TABS.map((item, index) => {
              const active = activeIndex === index;
              const Icon = item.icon;
              const isCreate = item.isCreate;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 py-1.5",
                    active ? "text-primary" : "text-text-muted hover:text-text-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-9 w-9 items-center justify-center rounded-2xl transition-transform",
                      isCreate && createActive && "opacity-0",
                      active && !(isCreate && createActive) && "scale-105",
                    )}
                  >
                    <Icon size={isCreate ? 20 : 19} strokeWidth={active ? 2.5 : 2} />
                  </span>
                  <span className="max-w-full truncate text-[9px] font-semibold leading-tight sm:text-[10px]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
