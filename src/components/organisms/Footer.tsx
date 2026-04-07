import Link from "next/link";
import Logo from "@/components/atoms/Logo";
import { APP_NAME, ROUTES } from "@/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary-light blur-3xl opacity-50" />
      <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-accent blur-3xl opacity-40" />

      <div className="relative mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              Co-abonnement au Sénégal, au Congo et au Gabon : rejoignez un groupe ou proposez votre abonnement pour le rentabiliser.
              Tokabola &mdash; partageons ensemble.
            </p>
            <div className="mt-6 flex gap-3">
              {["Wave", "Orange Money", "Free Money"].map((pm) => (
                <span key={pm} className="rounded-lg bg-primary-light px-3 py-1.5 text-xs font-medium text-text-secondary ring-1 ring-black/4">
                  {pm}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">
              Produit
            </h4>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href={ROUTES.EXPLORE} className="text-text-secondary transition hover:text-primary">Explorer</Link>
              <Link href="#how" className="text-text-secondary transition hover:text-primary">Comment ça marche</Link>
              <Link href="#" className="text-text-secondary transition hover:text-primary">Tarifs</Link>
              <Link href={ROUTES.SIGNUP} className="text-text-secondary transition hover:text-primary">Créer un compte</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">
              Support
            </h4>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="#" className="text-text-secondary transition hover:text-primary">Centre d&apos;aide</Link>
              <Link href="#" className="text-text-secondary transition hover:text-primary">FAQ</Link>
              <Link href="#" className="text-text-secondary transition hover:text-primary">Nous contacter</Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">
              Légal
            </h4>
            <nav className="flex flex-col gap-3 text-sm">
              <Link href="#" className="text-text-secondary transition hover:text-primary">CGU</Link>
              <Link href="#" className="text-text-secondary transition hover:text-primary">Confidentialité</Link>
              <Link href="#" className="text-text-secondary transition hover:text-primary">Mentions légales</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
          </p>
          <p className="text-sm text-text-muted">
            Tobongisa ensemble — Dakar, Brazzaville, Libreville.
          </p>
        </div>
      </div>
    </footer>
  );
}
