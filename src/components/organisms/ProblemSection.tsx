"use client";

import { FiTrendingDown, FiAlertCircle, FiDollarSign } from "react-icons/fi";
import type { IconType } from "react-icons";
import { StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { motion } from "framer-motion";

const headerMint =
  "bg-gradient-to-b from-primary-light from-[8%] via-[#eef9f4] via-[55%] to-white to-[100%]";
const headerBeige =
  "bg-gradient-to-b from-[#FFE0B2] from-[5%] via-[#ffe8c8] via-[50%] to-white to-[100%]";

function ProblemCard({
  stat,
  desc,
  sub,
  icon: Icon,
  headerTone,
}: {
  stat: string;
  desc: string;
  sub: string;
  icon: IconType;
  headerTone: "mint" | "beige";
}) {
  const headerClass = headerTone === "beige" ? headerBeige : headerMint;
  const iconClass =
    headerTone === "beige" ? "text-amber-900/35" : "text-primary/30";

  return (
    <motion.div
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/4"
      whileHover={{ y: -6, boxShadow: "0 24px 48px -12px rgb(40 188 133 / 0.12)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`flex h-36 shrink-0 items-center justify-center transition-transform group-hover:scale-[1.02] ${headerClass}`}
      >
        <Icon size={44} className={iconClass} />
      </div>
      <div className="relative -mt-8 mx-4 flex min-h-0 flex-1 flex-col rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/4">
        <p className="text-2xl font-extrabold text-dark-brand md:text-3xl">
          {stat}
        </p>
        <p
          className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary"
          title={desc}
        >
          {desc}
        </p>
      </div>
      <div className="mt-auto px-5 pt-4 pb-6">
        <p className="line-clamp-2 text-base font-bold text-text" title={sub}>
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-white/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
        <StaggerContainer className="grid gap-6 md:grid-cols-3 md:items-stretch" stagger={0.12}>
          {[
            {
              id: "spend",
              icon: FiTrendingDown,
              headerTone: "mint" as const,
              stat: "28 000 FCFA",
              desc: "Budget moyen mensuel pour vos abos au Sénégal, Congo et Gabon.",
              sub: "Même services, moins cher : c’est le cœur de l’offre Kabola.",
            },
            {
              id: "unused",
              icon: FiAlertCircle,
              headerTone: "beige" as const,
              stat: "72%",
              desc: "Beaucoup paient un maxi-forfait pour une utilisation moyenne.",
              sub: "Payez moins, partagez les places inutilisées.",
            },
            {
              id: "trust",
              icon: FiDollarSign,
              headerTone: "mint" as const,
              stat: "0 solution",
              desc: "Le partage entre inconnus, sans filet : trop risqué pour durer.",
              sub: "Kabola sécurise l’argent, les profils et les paiements locaux.",
            },
          ].map((card) => (
            <StaggerItem key={card.id} className="h-full">
              <ProblemCard
                icon={card.icon}
                headerTone={card.headerTone}
                stat={card.stat}
                desc={card.desc}
                sub={card.sub}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
