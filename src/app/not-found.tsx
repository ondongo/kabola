import Link from "next/link";
import { ROUTES } from "@/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-xl font-bold text-text">Page introuvable</h1>
      <p className="max-w-md text-text-secondary">
        La page demandée n’existe pas ou a été déplacée.
      </p>
      <Link
        href={ROUTES.HOME}
        className="mt-4 rounded-full bg-primary px-6 py-3 font-semibold text-white"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
