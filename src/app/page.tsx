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
      <header className="sticky top-4 z-60 mx-4 md:mx-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white/80 px-6 py-4 shadow-lg shadow-black/4 backdrop-blur-xl ring-1 ring-black/4">
          <Logo size="md" />

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#how" className="text-sm font-medium text-text-secondary transition hover:text-primary">Comment ça marche</Link>
            <Link href="#features" className="text-sm font-medium text-text-secondary transition hover:text-primary">Fonctionnalités</Link>
            <Link href="#trust" className="text-sm font-medium text-text-secondary transition hover:text-primary">Confiance</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="rounded-full px-5 py-2 text-sm font-medium text-text-secondary transition hover:text-primary hover:bg-primary-light/50"
            >
              Se connecter
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 -mt-16">
        {/* Un seul dégradé hero → marquee : plus de couture entre deux <section> */}
        <div className="landing-hero-marquee-continuum">
          <HeroSection />
          <div className="relative z-10 -mt-10 rounded-t-[2rem] bg-transparent pt-8 md:-mt-12 md:rounded-t-[2.5rem] md:pt-10">
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
