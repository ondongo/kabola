import Link from "next/link";
import Logo from "@/components/atoms/Logo";
import { APP_NAME, ROUTES, buildLoginHref } from "@/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary-light blur-3xl opacity-50" />
      <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-accent blur-3xl opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary md:mt-4">
              <span className="md:hidden">
                Co-abonnement SN, CG, GA — groupe ou partage d&apos;abo. Tokabola.
              </span>
              <span className="hidden md:inline">
                Co-abonnement au Sénégal, au Congo et au Gabon : rejoignez un groupe ou proposez votre abonnement pour le rentabiliser.
                Tokabola &mdash; partageons ensemble.
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
              {["Wave", "Orange Money", "Free Money"].map((pm) => (
                <span
                  key={pm}
                  className="rounded-lg bg-primary-light px-2 py-1 text-[10px] font-medium text-text-secondary ring-1 ring-black/4 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-full grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 lg:col-span-3 lg:grid-cols-3 lg:gap-10">
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted sm:mb-4 sm:text-xs">
                Produit
              </h4>
              <nav className="flex flex-col gap-2 text-xs sm:gap-3 sm:text-sm">
                <Link href={ROUTES.SUBSCRIPTIONS_BROWSE} className="text-text-secondary transition hover:text-primary">
                  Explorer
                </Link>
                <Link href="#how" className="text-text-secondary transition hover:text-primary">
                  <span className="md:hidden">Comment</span>
                  <span className="hidden md:inline">Comment ça marche</span>
                </Link>
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  Tarifs
                </Link>
                <Link href={buildLoginHref()} className="text-text-secondary transition hover:text-primary">
                  Commencer
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted sm:mb-4 sm:text-xs">
                Support
              </h4>
              <nav className="flex flex-col gap-2 text-xs sm:gap-3 sm:text-sm">
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  <span className="md:hidden">Aide</span>
                  <span className="hidden md:inline">Centre d&apos;aide</span>
                </Link>
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  FAQ
                </Link>
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  Contact
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted sm:mb-4 sm:text-xs">
                Légal
              </h4>
              <nav className="flex flex-col gap-2 text-xs sm:gap-3 sm:text-sm">
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  CGU
                </Link>
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  <span className="md:hidden">Confid.</span>
                  <span className="hidden md:inline">Confidentialité</span>
                </Link>
                <Link href="#" className="text-text-secondary transition hover:text-primary">
                  <span className="md:hidden">Mentions</span>
                  <span className="hidden md:inline">Mentions légales</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:mt-12 sm:flex-row sm:gap-4 sm:pt-8">
          <p className="text-center text-xs text-text-muted sm:text-left sm:text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}
            <span className="hidden sm:inline">. Tous droits réservés.</span>
          </p>
          <p className="hidden text-sm text-text-muted sm:block">
            Tobongisa ensemble — Dakar, Brazzaville, Libreville.
          </p>
          <p className="text-center text-[11px] text-text-muted sm:hidden">
            Dakar · Brazzaville · Libreville
          </p>
        </div>
      </div>
    </footer>
  );
}
