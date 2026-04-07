"use client";

import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ServiceIconInline } from "@/components/atoms/ServiceIcon";
import { motion } from "framer-motion";

const SAVINGS = [
  { label: "Netflix Premium", service: "Netflix", alone: 6500, shared: 1950, save: 70 },
  { label: "Spotify Famille", service: "Spotify", alone: 4500, shared: 1200, save: 73 },
  { label: "Apple Music", service: "Apple Music", alone: 7000, shared: 2000, save: 71 },
  { label: "Canal+", service: "Canal+", alone: 10000, shared: 4000, save: 60 },
];

export default function SavingsSection() {
  return (
    <section className="relative z-10 -mt-6 overflow-hidden rounded-t-[2rem] bg-white py-16 pt-12 md:rounded-t-[2.5rem] md:py-24 md:pt-14">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary-light/35 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="md:flex md:items-center md:gap-16">
          <ScrollReveal variant="fade-right" className="flex-1">
            <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-dark">
              Économies
            </span>
            <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-text sm:text-3xl md:text-4xl">
              Économies côté membre,<br />rentabilité côté hôte
            </h2>
            <p className="mt-4 max-w-md text-lg text-text-secondary">
              En moyenne, <strong className="text-text">15 000 FCFA</strong> économisés par mois en rejoignant quelques
              groupes — et chaque place vendue sur votre propre abonnement allège votre facture.
            </p>
          </ScrollReveal>

          <div className="mt-10 flex-1 md:mt-0">
            <StaggerContainer className="grid grid-cols-2 gap-4" stagger={0.08}>
              {SAVINGS.map((item) => (
                <StaggerItem key={item.label}>
                  <motion.div
                    className="group rounded-2xl bg-gray-50 p-5 ring-1 ring-black/4"
                    whileHover={{ y: -3, boxShadow: "0 20px 40px -12px rgb(40 188 133 / 0.12)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <ServiceIconInline name={item.service} size={20} />
                      <p className="text-sm font-bold text-text">{item.label}</p>
                    </div>
                    <p className="text-xs text-text-muted line-through">
                      {item.alone.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-xl font-extrabold text-primary">
                      {item.shared.toLocaleString("fr-FR")} FCFA
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-primary/15">
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
