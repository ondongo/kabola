"use client";

import Link from "next/link";
import { ROUTES, buildLoginHref } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import ScrollReveal from "@/components/atoms/ScrollReveal";
import { cn } from "@/utils/cn";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function FloatingBadge({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-dark-brand shadow-lg ring-1 ring-black/4 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Icons.check size={14} className="text-primary" />
      {text}
    </motion.span>
  );
}

function ParallaxLayer({ children, speed = 0.15, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -120, speed * 120]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn("relative", className)}>
      {children}
    </motion.div>
  );
}

function SectionWrapper({
  children,
  className,
  zIndex,
  id,
}: {
  children: React.ReactNode;
  className: string;
  zIndex: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={{ zIndex, scale, opacity }}
    >
      {children}
    </motion.section>
  );
}

export default function ParallaxFeatures() {
  return (
    <div className="relative">
      {/* ── Section 1: Paiements sécurisés ── */}
      <SectionWrapper
        className="parallax-section relative rounded-t-3xl bg-primary-light pt-14 pb-20 sm:rounded-t-[2.5rem] sm:pt-20 sm:pb-28 md:pt-28 md:pb-36"
        zIndex={10}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <div className="md:flex md:items-center md:gap-16">
            <ScrollReveal variant="fade-right" className="flex-1">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Icons.shield size={14} /> Paiements
              </span>
              <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-text sm:text-3xl md:text-4xl">
                Payez avec mobile money
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary sm:mt-5 sm:text-lg">
                Pas besoin de carte bancaire. Payez votre part avec Wave, Orange Money
                ou Free Money — le mobile money du Sénégal, du Congo ou du Gabon.
                Votre argent est protégé en escrow jusqu&apos;à confirmation.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                {["Wave", "Orange Money", "Free Money"].map((pm) => (
                  <motion.span
                    key={pm}
                    className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-dark-brand shadow-sm ring-1 ring-black/4 sm:px-5 sm:py-3 sm:text-sm"
                    whileHover={{ y: -2, boxShadow: "0 8px 24px -4px rgb(40 188 133 / 0.12)" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {pm}
                  </motion.span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-left" delay={0.15} className="relative mt-10 flex-1 md:mt-0">
              <div className="mx-auto w-full max-w-70 sm:max-w-xs">
                <motion.div
                  className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/4 sm:rounded-3xl sm:p-6"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center glow-ring">
                      <Icons.siNetflix size={20} style={{ color: "#E50914" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">Paiement Netflix</p>
                      <p className="text-xs text-text-muted">Partage Famille Premium</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-accent p-4 text-center">
                    <p className="text-xs text-text-muted">Votre part mensuelle</p>
                    <p className="text-3xl font-extrabold text-dark-brand">1 950 <span className="text-base">FCFA</span></p>
                    <p className="mt-1 text-xs text-text-muted line-through">au lieu de 6 500 FCFA</p>
                  </div>
                  <div className="mt-4 rounded-xl bg-primary py-3 text-center text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-hover">
                    Payer avec Wave
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary">
                    <Icons.shield size={12} />
                    <span>Protégé par escrow Kabola</span>
                  </div>
                </motion.div>

                <ParallaxLayer speed={0.2}>
                  <FloatingBadge text="Paiement reçu" className="absolute top-0 -right-4 hidden animate-float md:inline-flex" />
                </ParallaxLayer>
                <ParallaxLayer speed={-0.15}>
                  <FloatingBadge text="Accès confirmé" className="absolute -bottom-3 -left-4 hidden animate-float animation-delay-400 md:inline-flex" />
                </ParallaxLayer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Section 2: Confiance (#trust — ancre menu) ── */}
      <SectionWrapper
        id="trust"
        className="parallax-section relative -mt-6 scroll-mt-24 overflow-hidden rounded-t-3xl bg-white pt-14 pb-20 sm:-mt-8 sm:scroll-mt-28 sm:rounded-t-[2.5rem] sm:pt-20 sm:pb-28 md:pt-28 md:pb-36"
        zIndex={20}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-primary-light/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-8 -left-12 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
          <div className="md:flex md:flex-row-reverse md:items-center md:gap-16">
            <ScrollReveal variant="fade-left" className="flex-1">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-primary/15 shadow-sm">
                <Icons.check size={14} /> Confiance
              </span>
              <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-text sm:text-3xl md:text-4xl">
                Chaque membre est vérifié
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary sm:mt-5 sm:text-lg">
                Score de confiance, vérification d&apos;identité, factures validées.
                Notre système garantit que chaque partage est fiable et sécurisé.
              </p>
              <div className="mt-6 grid max-w-sm grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
                <motion.div
                  className="rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-2xl font-extrabold text-primary">98%</span>
                  <p className="text-sm text-text-secondary">taux de satisfaction</p>
                </motion.div>
                <motion.div
                  className="rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-2xl font-extrabold text-text">0</span>
                  <p className="text-sm text-text-secondary">cas de fraude</p>
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-right" delay={0.15} className="relative mt-10 flex-1 md:mt-0">
              <div className="mx-auto w-full max-w-70 sm:max-w-xs">
                <motion.div
                  className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:rounded-3xl sm:p-6"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-primary-light flex items-center justify-center text-xl font-bold text-primary glow-ring">
                      F
                    </div>
                    <div>
                      <p className="text-base font-bold text-text">Fatou Diop</p>
                      <p className="text-xs text-text-muted">Membre depuis Janv. 2025</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Score de confiance", value: "98/100", color: "text-primary" },
                      { label: "Partages réussis", value: "24", color: "text-dark-brand" },
                      { label: "Facture vérifiée", value: "Oui", color: "text-primary" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <ParallaxLayer speed={0.2}>
                  <FloatingBadge text="Identité vérifiée" className="absolute -top-3 -left-4 hidden animate-float animation-delay-200 md:inline-flex" />
                </ParallaxLayer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Section 3: Communauté — fond beige doux #FFF3E5 (accent) ── */}
      <SectionWrapper
        className="parallax-section relative -mt-6 overflow-hidden rounded-t-3xl bg-accent pt-14 pb-16 text-text sm:-mt-8 sm:rounded-t-[2.5rem] sm:pt-20 sm:pb-20 md:pt-28 md:pb-28"
        zIndex={30}
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/35 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
          <ScrollReveal variant="blur-up">
            <div className="text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm ring-1 ring-black/5">
                <Icons.users size={14} /> Communauté
              </span>
              <h2 className="mx-auto max-w-sm text-2xl font-extrabold leading-snug tracking-tight text-text sm:max-w-2xl sm:text-3xl md:max-w-3xl md:text-4xl">
                Une communauté qui achète et qui propose
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary sm:mt-5 sm:text-lg">
                Membres et hôtes : des milliers de personnes font déjà tourner leurs abonnements
                sur Kabola en toute confiance. Rejoignez un groupe ou ouvrez le vôtre.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6">
            {[
              { display: "2 000+", label: "membres actifs" },
              { display: "15 M+", label: "FCFA économisés" },
              { display: "50+", label: "services disponibles" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} variant="scale-in" delay={i * 0.1}>
                <motion.div
                  className="rounded-2xl bg-white/85 p-6 text-center shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-8"
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 28px -8px rgb(0 0 0 / 0.08)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-3xl font-extrabold text-dark-brand sm:text-4xl md:text-5xl">{stat.display}</span>
                  <p className="mt-2 text-sm text-text-secondary sm:text-base">{stat.label}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variant="fade-up" delay={0.3}>
            <div className="mt-10 text-center sm:mt-14">
              <Link
                href={buildLoginHref()}
                className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl sm:px-8 sm:py-4 sm:text-base"
              >
                <span className="flex items-center gap-2.5">
                  Créer mon compte
                  <Icons.arrowRight size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </SectionWrapper>
    </div>
  );
}
