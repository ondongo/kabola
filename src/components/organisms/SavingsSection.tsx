"use client";

import ScrollReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/atoms/ScrollReveal";
import { ServiceIconInline } from "@/components/atoms/ServiceIcon";
import { motion } from "framer-motion";

const SAVINGS = [
  {
    label: "Netflix Premium",
    service: "Netflix",
    alone: 6500,
    shared: 1950,
    save: 70,
  },
  {
    label: "Spotify Famille",
    service: "Spotify",
    alone: 4500,
    shared: 1200,
    save: 73,
  },
  {
    label: "Apple Music",
    service: "Apple Music",
    alone: 7000,
    shared: 2000,
    save: 71,
  },
  { label: "Canal+", service: "Canal+", alone: 10000, shared: 4000, save: 60 },
];

export default function SavingsSection() {
  return (
    <section className="relative z-10 -mt-4 overflow-hidden rounded-t-3xl bg-white py-12 pt-10 sm:-mt-6 sm:rounded-t-4xl sm:py-16 sm:pt-12 md:rounded-t-[2.5rem] md:py-24 md:pt-14">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary-light/35 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">
        <div className="md:flex md:items-center md:gap-16">
          <ScrollReveal variant="fade-right" className="flex-1">
            <div className="text-start space-x-2">
              <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-dark">
                Seul
              </span>
              <span className="mb-4 inline-block rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                En groupe
              </span>
            </div>
            <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-text sm:text-3xl md:text-4xl">
              Économie & Rentabilité
            </h2>
            <p className="mt-4 max-w-md text-base text-text-secondary sm:text-lg">
              En moyenne, <strong className="text-text">15 000 FCFA</strong>{" "}
              économisés par mois en rejoignant quelques groupes — et chaque
              place vendue sur votre propre abonnement allège votre facture.
            </p>
          </ScrollReveal>

          <div className="mt-8 flex-1 md:mt-0">
            <StaggerContainer className="grid grid-cols-2 gap-2.5 sm:gap-4" stagger={0.08}>
              {SAVINGS.map((item) => (
                <StaggerItem key={item.label}>
                  <motion.div
                    className="group rounded-xl bg-gray-50 p-3.5 ring-1 ring-black/4 sm:rounded-2xl sm:p-5"
                    whileHover={{
                      y: -3,
                      boxShadow: "0 20px 40px -12px rgb(40 188 133 / 0.12)",
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mb-2 flex min-w-0 items-center gap-2 sm:mb-3 sm:gap-2.5">
                      <span className="shrink-0">
                        <ServiceIconInline name={item.service} size={18} />
                      </span>
                      <p className="truncate text-xs font-bold text-text sm:text-sm">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-[0.65rem] text-text-muted line-through sm:text-xs">
                      {item.alone.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-lg font-extrabold text-primary sm:text-xl">
                      {item.shared.toLocaleString("fr-FR")} FCFA
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-primary-light px-2 py-0.5 text-[0.65rem] font-bold text-primary ring-1 ring-primary/15 sm:mt-2 sm:px-2.5 sm:text-xs">
                      -{item.save}%
                    </span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
