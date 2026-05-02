"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import { Icons } from "@/constants/icons.constants";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { LANDING_IMAGES } from "@/constants/landing-images";
import { motion } from "framer-motion";

function ValueProp({ icon: Icon, title, desc }: { icon: IconType; title: string; desc: string }) {
  return (
    <motion.div
      className="group relative flex items-start gap-3 rounded-2xl bg-white/90 p-4 ring-1 ring-black/5 transition-shadow duration-300 ease-out backdrop-blur-sm sm:gap-4 sm:p-5"
      whileHover={{ y: -3, boxShadow: "0 16px 32px -8px rgb(40 188 133 / 0.1)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-transform duration-300 ease-out group-hover:scale-[1.04]">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-text">{title}</h4>
        <p className="mt-1 text-sm text-text-secondary">{desc}</p>
      </div>
    </motion.div>
  );
}

const STEPS = [
  {
    num: 1,
    title: "Choisissez ou proposez un abo",
    desc: "Netflix, Spotify, Canal+… Parcourez les groupes disponibles ou publiez le vôtre pour remplir les places libres et rentabiliser votre forfait.",
    image: LANDING_IMAGES.howItWorksSteps[0],
    alt: "Personnes regardant du contenu ensemble sur un canapé",
    reverse: false,
  },
  {
    num: 2,
    title: "Payez avec mobile money",
    desc: "Wave, Orange Money, Free Money… Votre part est protégée en escrow jusqu’à confirmation.",
    image: LANDING_IMAGES.howItWorksSteps[1],
    alt: "Paiement mobile et carte bancaire",
    reverse: true,
  },
  {
    num: 3,
    title: "Profitez, économisez ou encaissez",
    desc: "Membre : accès sécurisés et jusqu’à 70 % d’économie. Hôte : chaque place occupée réduit votre facture nette.",
    image: LANDING_IMAGES.howItWorksSteps[2],
    alt: "Économies et budget sous contrôle",
    reverse: false,
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-transparent py-12 pb-16 sm:py-16 sm:pb-20 md:py-24 md:pb-28">
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-white/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
        <ScrollReveal variant="blur-up">
          <div className="text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Simple & rapide
            </span>
            <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-text sm:text-3xl md:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary sm:text-lg">
              Que vous rejoigniez un groupe ou que vous ouvriez le vôtre : tout se passe en toute sécurité.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="mt-10 flex flex-col gap-10 sm:mt-14 sm:gap-14 md:mt-20 md:gap-20" stagger={0.1}>
          {STEPS.map((step) => (
            <StaggerItem key={step.num}>
              <div
                className={`flex flex-col items-center gap-8 md:gap-12 lg:gap-16 ${
                  step.reverse ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="relative w-full shrink-0 md:w-[46%]">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-primary-light/30 shadow-lg ring-1 ring-black/5 md:rounded-3xl">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 46vw"
                    />
                  </div>
                  <span className="absolute -bottom-3 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white shadow-lg shadow-primary/30 md:left-8">
                    {step.num}
                  </span>
                </div>

                <div className="w-full flex-1 pt-2 md:pt-0">
                  <h3 className="text-2xl font-extrabold text-text md:text-3xl">{step.title}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary md:text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <StaggerContainer className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" stagger={0.06}>
          {[
            { icon: Icons.lock, title: "Escrow sécurisé", desc: "Fonds bloqués tant que l'accès n'est pas confirmé" },
            { icon: Icons.fileText, title: "Factures vérifiées", desc: "Les hôtes qui proposent un abonnement sont vérifiés par notre système" },
            { icon: Icons.smartphone, title: "Paiements locaux", desc: "Moyens adaptés au Sénégal, au Congo et au Gabon" },
            { icon: Icons.star, title: "Score de confiance", desc: "Système de notation transparent entre membres" },
          ].map((vp) => (
            <StaggerItem key={vp.title}>
              <ValueProp icon={vp.icon} title={vp.title} desc={vp.desc} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
