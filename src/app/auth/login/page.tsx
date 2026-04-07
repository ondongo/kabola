import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Se connecter",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text">Bon retour !</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Accédez aux groupes que vous rejoignez et à ceux que vous proposez
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-text-secondary">
        Pas encore de compte ?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-semibold text-primary hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
