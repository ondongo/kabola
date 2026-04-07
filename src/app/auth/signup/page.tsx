import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./_components/SignupForm";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Créer un compte",
};

export default function SignupPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text">
          Créer votre compte
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Économisez sur des abonnements ou rentabilisez les vôtres
        </p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-text-secondary">
        Déjà un compte ?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-primary hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
