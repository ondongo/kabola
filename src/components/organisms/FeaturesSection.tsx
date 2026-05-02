"use client";

import Image from "next/image";
import type { IconType } from "react-icons";
import { Icons } from "@/constants/icons.constants";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { LANDING_IMAGES } from "@/constants/landing-images";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

function ValueProp({
  icon: Icon,
  title,
  desc,
  descShort,
}: {
  icon: IconType;
  title: string;
  desc: string;
  descShort?: string;
}) {
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
        <p className="mt-1 text-sm text-text-secondary">
          <span className="md:hidden">{descShort ?? desc}</span>
          <span className="hidden md:inline">{desc}</span>
        </p>
      </div>
    </motion.div>
  );
}

const STEPS = [
  {
    num: 1,
    title: "Choisissez ou proposez un abo",
    desc: "Netflix, Spotify, Canal+… Parcourez les groupes disponibles ou publiez le vôtre pour remplir les places libres et rentabiliser votre forfait.",
    descShort:
      "Parcourez les groupes ou publiez le vôtre pour remplir les places et rentabiliser.",
    image: LANDING_IMAGES.howItWorksSteps[0],
    alt: "Personnes regardant du contenu ensemble sur un canapé",
    reverse: false,
  },
  {
    num: 2,
    title: "Payez avec mobile money",
    desc: "Wave, Orange Money, Free Money… Votre part est protégée en escrow jusqu’à confirmation.",
    descShort: "Wave, OM, Free Money — part en escrow jusqu’à confirmation.",
    image: LANDING_IMAGES.howItWorksSteps[1],
    alt: "Paiement mobile et carte bancaire",
    reverse: true,
  },
  {
    num: 3,
    title: "Profitez, économisez ou encaissez",
    desc: "Membre : accès sécurisés et jusqu’à 70 % d’économie. Hôte : chaque place occupée réduit votre facture nette.",
    descShort: "Jusqu’à 70 % d’économie en membre ; en hôte, chaque place réduit votre facture.",
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

        <div className="max-md:relative max-md:left-1/2 max-md:w-screen max-md:-translate-x-1/2 md:static md:left-auto md:w-auto md:translate-x-0">
          <StaggerContainer
            className={cn(
              "mt-10 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "max-md:flex max-md:snap-x max-md:snap-proximity max-md:flex-row max-md:gap-4 max-md:overflow-x-auto max-md:overflow-y-hidden max-md:scroll-px-4 max-md:px-4",
              "sm:mt-14 md:mt-20 md:flex md:flex-col md:gap-20 md:overflow-visible md:px-0 md:pb-0 md:scroll-p-0 md:snap-none md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:auto",
            )}
            stagger={0.1}
          >
          {STEPS.map((step, index) => (
            <StaggerItem
              key={step.num}
              className={cn(
                "w-full shrink-0 snap-start md:w-auto md:snap-normal md:shrink",
                "max-md:w-[min(22rem,calc(100vw-5rem))]",
                index === STEPS.length - 1 ? "snap-normal" : "snap-always",
              )}
            >
              <div
                className={`flex flex-col items-center gap-6 md:gap-12 lg:gap-16 ${
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
                  <span className="absolute -bottom-3 left-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-extrabold text-white shadow-lg shadow-primary/30 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-[0.95rem] md:left-8 md:h-12 md:w-12 md:text-lg">
                    {step.num}
                  </span>
                </div>

                <div className="w-full flex-1 pt-2 md:pt-0">
                  <h3 className="text-lg font-extrabold leading-snug tracking-tight text-text sm:text-xl md:text-3xl md:leading-tight md:tracking-normal">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary md:mt-4 md:text-lg">
                    <span className="md:hidden">{step.descShort}</span>
                    <span className="hidden md:inline">{step.desc}</span>
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
          </StaggerContainer>
        </div>

        <StaggerContainer className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" stagger={0.06}>
          {[
            {
              icon: Icons.lock,
              title: "Escrow sécurisé",
              desc: "Fonds bloqués tant que l'accès n'est pas confirmé",
              descShort: "Bloqués jusqu’à confirmation d’accès.",
            },
            {
              icon: Icons.fileText,
              title: "Factures vérifiées",
              desc: "Les hôtes qui proposent un abonnement sont vérifiés par notre système",
              descShort: "Hôtes vérifiés par Kabola.",
            },
            {
              icon: Icons.smartphone,
              title: "Paiements locaux",
              desc: "Moyens adaptés au Sénégal, au Congo et au Gabon",
              descShort: "Adaptés au Sénégal, Congo et Gabon.",
            },
            {
              icon: Icons.star,
              title: "Score de confiance",
              desc: "Système de notation transparent entre membres",
              descShort: "Notation transparente entre membres.",
            },
          ].map((vp) => (
            <StaggerItem key={vp.title}>
              <ValueProp icon={vp.icon} title={vp.title} desc={vp.desc} descShort={vp.descShort} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
