import HeroSection from "@/components/organisms/HeroSection";
import FeaturesSection from "@/components/organisms/FeaturesSection";
import ProblemSection from "@/components/organisms/ProblemSection";
import ParallaxFeatures from "@/components/organisms/ParallaxFeatures";
import PopularServices from "@/components/organisms/PopularServices";
import Footer from "@/components/organisms/Footer";
import Logo from "@/components/atoms/Logo";
import Link from "next/link";
import { ROUTES } from "@/constants";
import SavingsSection from "@/components/organisms/SavingsSection";
import BrandMarquee from "@/components/organisms/BrandMarquee";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* ── HEADER FLOTTANT ── */}
      <header className="sticky top-2 z-60 mx-3 sm:top-4 sm:mx-4 md:mx-8">
        <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 rounded-full bg-white/80 px-3 py-2.5 shadow-lg shadow-black/4 backdrop-blur-xl ring-1 ring-black/4 sm:gap-3 sm:px-4 sm:py-3 md:px-6 md:py-4">
          <Logo size="md" priority />

          <nav className="hidden min-w-0 items-center gap-6 lg:gap-8 md:flex">
            <Link href="#how" className="shrink-0 text-sm font-medium text-text-secondary transition hover:text-primary">Comment ça marche</Link>
            <Link href="#features" className="shrink-0 text-sm font-medium text-text-secondary transition hover:text-primary">Fonctionnalités</Link>
            <Link href="#trust" className="shrink-0 text-sm font-medium text-text-secondary transition hover:text-primary">Confiance</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="rounded-full px-2.5 py-2 text-xs font-medium text-text-secondary transition hover:bg-primary-light/50 hover:text-primary sm:px-4 sm:text-sm"
            >
              <span className="sm:hidden">Connexion</span>
              <span className="hidden sm:inline">Se connecter</span>
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              className="rounded-full bg-primary px-3 py-2 text-xs font-semibold whitespace-nowrap text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg sm:px-5 sm:text-sm"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 -mt-14 sm:-mt-16">
        {/* Un seul dégradé hero → marquee : plus de couture entre deux <section> */}
        <div className="landing-hero-marquee-continuum">
          <HeroSection />
          <div className="relative z-10 -mt-6 rounded-t-3xl bg-transparent pt-6 sm:-mt-8 sm:pt-7 md:-mt-12 md:rounded-t-[2.5rem] md:pt-10">
            <BrandMarquee />
          </div>
        </div>

        <div className="bg-white">
          <ProblemSection />
          <div id="how">
            <FeaturesSection />
          </div>
        </div>

        <div id="features">
          <PopularServices />
        </div>

        <ParallaxFeatures />

        <SavingsSection />
      </main>

      <Footer />
    </div>
  );
}
