"use client";

import Link from "next/link";
import { ROUTES, buildLoginHref } from "@/constants";
import { useAuth } from "@/hooks/useAuth";

export default function LandingHeaderActions() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="h-10 w-32 shrink-0 animate-pulse rounded-full bg-gray-200/90"
        aria-hidden
      />
    );
  }

  if (user) {
    return (
      <Link
        href={ROUTES.DASHBOARD}
        className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover sm:px-6"
      >
        Tableau de bord
      </Link>
    );
  }

  return (
    <Link
      href={buildLoginHref()}
      className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover sm:px-6"
    >
      Commencer
    </Link>
  );
}
