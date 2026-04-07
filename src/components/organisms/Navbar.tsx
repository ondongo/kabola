"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCompass,
  FiList,
  FiUser,
} from "react-icons/fi";
import { cn } from "@/utils/cn";
import Logo from "@/components/atoms/Logo";
import { ROUTES } from "@/constants";

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: "Accueil", icon: FiHome },
  { href: ROUTES.EXPLORE, label: "Explorer", icon: FiCompass },
  { href: ROUTES.MY_SUBSCRIPTIONS, label: "Mes abos", icon: FiList },
  { href: ROUTES.PROFILE, label: "Profil", icon: FiUser },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="hidden md:flex items-center justify-between px-6 py-5 border-b border-border bg-white sticky top-0 z-50">
        <Logo size="md" href={ROUTES.DASHBOARD} />
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
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
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-white px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-text-muted",
              )}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
