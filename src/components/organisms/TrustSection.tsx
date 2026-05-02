"use client";

import Link from "next/link";
import { ROUTES, buildLoginHref } from "@/constants";
import { Icons } from "@/constants/icons.constants";
import type { IconType } from "react-icons";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { name: "Fatou D.", city: "Dakar, Sénégal", text: "J'économise 15 000 FCFA par mois en rejoignant des groupes, et j'ai aussi ouvert ma place Spotify pour rentabiliser mon forfait.", rating: 5 },
  { name: "Moussa N.", city: "Brazzaville, Congo", text: "Facile à utiliser, Orange Money en deux temps. Je recommande à tous mes amis.", rating: 5 },
  { name: "Awa S.", city: "Libreville, Gabon", text: "Le score de confiance me rassure beaucoup. Je sais que je suis dans un bon groupe.", rating: 5 },
  { name: "Ibrahima K.", city: "Pointe-Noire, Congo", text: "Le système d'escrow est top. Pas de risque d'arnaque, mon argent est protégé.", rating: 5 },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
  );
}

function TrustBadge({ icon: Icon, title, desc }: { icon: IconType; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
        <Icon size={24} />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-white/60">{desc}</p>
    </motion.div>
  );
}

export default function TrustSection() {
  return (
    <section className="relative z-10 -mt-6 overflow-hidden rounded-t-4xl bg-white py-16 pt-12 md:rounded-t-[2.5rem] md:py-28 md:pt-14">
      {/* Background decoration */}
      <div className="pointer-events-none absolute top-20 right-10 h-80 w-80 rounded-full bg-primary-light/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5">
        <ScrollReveal variant="blur-up">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-light px-5 py-2.5 ring-1 ring-primary/15">
              <Stars count={5} />
              <span className="text-sm font-semibold text-primary">4,8/5 de confiance</span>
            </div>
            <h2 className="mx-auto max-w-xl text-2xl font-extrabold leading-snug tracking-tight text-text sm:max-w-2xl sm:text-3xl md:text-4xl">
              Des milliers de personnes au Sénégal,<br />
              au Congo et au Gabon nous font confiance
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                className="flex flex-col rounded-2xl bg-gray-50 p-6 ring-1 ring-black/4"
                whileHover={{ y: -3, boxShadow: "0 20px 40px -12px rgb(40 188 133 / 0.1)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.city}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Stars count={t.rating} />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                  &quot;{t.text}&quot;
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal variant="scale-in" delay={0.2}>
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-dark-brand p-10 text-center text-white md:p-16">
            <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />

            <div className="relative">
              <h3 className="text-2xl font-extrabold md:text-3xl">
                Votre sécurité, notre priorité absolue
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
                Vos identifiants ne sont jamais partagés. Vos paiements sont protégés
                par escrow. Chaque membre est vérifié.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <TrustBadge icon={Icons.lock} title="Chiffrement SSL" desc="Données 100% sécurisées" />
                <TrustBadge icon={Icons.shield} title="Protection fraude" desc="Vérification manuelle + automatique" />
                <TrustBadge icon={Icons.xCircle} title="Annulation libre" desc="Sans engagement, sans frais" />
              </div>
              <Link
                href={buildLoginHref()}
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-[transform,box-shadow,background-color] duration-300 ease-out hover:bg-primary-hover hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  Commencer gratuitement
                  <svg className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
