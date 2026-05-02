"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProfileSignOutButton() {
  const { signOutUser } = useAuth();

  return (
    <button
      type="button"
      onClick={() => void signOutUser()}
      className="w-full rounded-xl bg-dark-brand py-3 text-sm font-semibold text-white transition hover:bg-dark-brand-light"
    >
      Se déconnecter
    </button>
  );
}
