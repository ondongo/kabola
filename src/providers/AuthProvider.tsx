"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";
import {
  getClientAuth,
  getGoogleProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "@/lib/firebase/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseClientConfigured()) {
      queueMicrotask(() => {
        setConfigError(
          "Variables Firebase manquantes ou invalides. Copiez la clé Web et le projectId depuis la console Firebase (Paramètres du projet → Vos applications) dans .env.local, puis redémarrez `npm run dev`.",
        );
        setLoading(false);
      });
      return;
    }

    let unsub: (() => void) | undefined;
    try {
      const auth = getClientAuth();
      unsub = onAuthStateChanged(auth, async (u) => {
        try {
          if (u) {
            const idToken = await u.getIdToken();
            await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });
          } else {
            await fetch("/api/auth/session", { method: "DELETE" });
          }
        } catch {
          /* session cookie optionnelle si Admin non configuré en local */
        }
        setUser(u);
        setLoading(false);
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Impossible d’initialiser Firebase Auth.";
      queueMicrotask(() => {
        setConfigError(msg);
        setLoading(false);
      });
    }

    return () => {
      unsub?.();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseClientConfigured()) return;
    try {
      const credential = await signInWithPopup(
        getClientAuth(),
        getGoogleProvider(),
      );
      const idToken = await credential.user.getIdToken();
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!sessionRes.ok) {
        console.error("Session serveur refusée après Google.", await sessionRes.json().catch(() => ({})));
        return;
      }
      /* Toujours le tableau de bord après Google : le skeleton s’affiche via `dashboard/loading.tsx`. */
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? String((e as { code: string }).code)
          : "";
      if (
        code.includes("api-key-invalid") ||
        code.includes("auth/api-key") ||
        code.includes("invalid-api-key")
      ) {
        setConfigError(
          "Clé API Firebase refusée : ouvrez la console Firebase → Paramètres du projet → Vos applications (Web), copiez la clé API dans NEXT_PUBLIC_FIREBASE_API_KEY, sans guillemets, puis redémarrez `npm run dev`.",
        );
        return;
      }
      console.error(e);
    }
  }, [router]);

  const signOutUser = useCallback(async () => {
    if (!isFirebaseClientConfigured()) return;
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(getClientAuth());
    setUser(null);
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      configError,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading, configError, signInWithGoogle, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé sous AuthProvider.");
  }
  return ctx;
}
