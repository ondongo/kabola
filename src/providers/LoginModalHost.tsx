"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SimpleModal } from "@/components/molecules/SimpleModal";
import GoogleLoginForm from "@/app/(auth)/login/_components/GoogleLoginForm";
import { useAuth } from "@/hooks/useAuth";

/**
 * Ouvre la modal lorsque l’URL contient `login=1` (ex. /?login=1&next=/dashboard).
 */
export function LoginModalHost() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const open = searchParams.get("login") === "1";

  const stripLoginFromUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleClose = useCallback(() => {
    stripLoginFromUrl();
  }, [stripLoginFromUrl]);

  useEffect(() => {
    if (loading || !user || !open) return;
    stripLoginFromUrl();
  }, [loading, user, open, stripLoginFromUrl]);

  return (
    <SimpleModal
      isOpen={open}
      onClose={handleClose}
      title="C’est parti !"
      compact
      className="w-[min(100vw-2rem,360px)]"
    >
      <GoogleLoginForm variant="modal" />
    </SimpleModal>
  );
}
