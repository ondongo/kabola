"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { LANDING_IMAGES } from "@/constants/landing-images";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/atoms/ScrollReveal";
import { ServiceIconInline } from "@/components/atoms/ServiceIcon";
import { motion } from "framer-motion";

const SERVICES = [
  { name: "Netflix", price: "1 950", gradient: "sub-card-netflix" },
  { name: "Spotify", price: "1 200", gradient: "sub-card-spotify" },
  { name: "Apple Music", price: "2 000", gradient: "sub-card-apple-music" },
  { name: "IPTV", price: "1 500", gradient: "sub-card-iptv" },
  { name: "Canva Pro", price: "2 500", gradient: "sub-card-canva" },
  { name: "Canal+", price: "4 000", gradient: "sub-card-canal" },
] as const;

const AVATARS = LANDING_IMAGES.popularServiceAvatars;

function avatarUrlsForCard(cardIndex: number): readonly [string, string, string] {
  const n = AVATARS.length;
  const a = AVATARS[cardIndex % n]!;
  const b = AVATARS[(cardIndex + 2) % n]!;
  const c = AVATARS[(cardIndex + 4) % n]!;
  return [a, b, c];
}

function MemberAvatarStack({ cardIndex }: { cardIndex: number }) {
  const urls = avatarUrlsForCard(cardIndex);
  return (
    <div className="mb-5 flex shrink-0 justify-center md:mb-6" aria-hidden>
      {urls.map((src, j) => (
        <div
          key={`${cardIndex}-${j}`}
          className="relative -ml-2.5 first:ml-0"
          style={{ zIndex: 3 - j }}
        >
          <Image
            src={src}
            alt=""
            role="presentation"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border-2 border-white/50 object-cover shadow-sm ring-1 ring-black/10"
            sizes="32px"
          />
        </div>
      ))}
    </div>
  );
}

export default function PopularServices() {
  return (
    <section className="relative z-20 -mt-8 overflow-hidden rounded-t-[2rem] bg-gray-900 pt-12 pb-20 md:rounded-t-[2.5rem] md:pt-14 md:pb-28">

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <ScrollReveal variant="blur-up">
          <div className="md:flex md:items-end md:justify-between">
            <div>
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Catalogue
              </span>
              <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-white sm:text-3xl md:max-w-2xl md:text-4xl">
                Plus de 50 services<br />à rejoindre ou à proposer
              </h2>
            </div>
            <Link
              href={ROUTES.EXPLORE}
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40 md:mt-0"
            >
              Voir tous les abonnements
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer
          className="mt-14 grid grid-cols-2 items-stretch gap-5 sm:grid-cols-3 sm:gap-6 md:mt-20 md:gap-7 xl:grid-cols-6 xl:gap-6"
          stagger={0.06}
        >
          {SERVICES.map((s, index) => (
            <StaggerItem key={s.name} className="h-full min-h-0">
              <Link href={ROUTES.EXPLORE} className="block h-full">
                <motion.div
                  className={`${s.gradient} group flex h-full min-h-[18.5rem] flex-col items-center rounded-2xl px-5 py-7 text-white sm:min-h-[17.5rem] md:px-6 md:py-8`}
                  whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.35)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MemberAvatarStack cardIndex={index} />

                  <div className="flex flex-1 flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <ServiceIconInline name={s.name} size={28} />
                    </div>

                    <p className="mt-3 min-h-[2.75rem] max-w-[12rem] text-center text-sm font-bold leading-snug line-clamp-2 md:text-[0.95rem]">
                      {s.name}
                    </p>

                    <div className="mt-auto flex w-full flex-col items-center pt-5">
                      <p className="text-sm font-bold md:text-base">{s.price} FCFA</p>
                      <p className="mt-0.5 text-xs opacity-70">/mois</p>
                      <span className="mt-5 inline-block rounded-full bg-white/20 px-5 py-2 text-xs font-semibold backdrop-blur-sm transition-all group-hover:bg-white/30 group-hover:scale-105 md:text-sm">
                        Rejoindre
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
