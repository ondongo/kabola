"use client";

import Link from "next/link";
import { ROUTES } from "@/constants";
import AnimatedCounter from "@/components/atoms/AnimatedCounter";
import { SiNetflix, SiSpotify, SiApplemusic, SiCanva } from "react-icons/si";
import { FiPlay, FiTv } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const easeFluid: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FloatingShape({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent pt-28 pb-20 md:pt-36 md:pb-32"
    >
      <FloatingShape
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl"
        delay={0}
      />
      <FloatingShape
        className="pointer-events-none absolute top-40 -right-20 h-96 w-96 rounded-full bg-accent blur-3xl opacity-50"
        delay={2}
      />
      {/* Pas de blob mint collé au bas : il empêchait le fondu vers le blanc du parent */}
      <FloatingShape
        className="pointer-events-none absolute bottom-24 left-1/3 h-48 w-48 rounded-full bg-primary-light/40 blur-3xl"
        delay={4}
      />

      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] animate-spin-slow opacity-[0.03]">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary" />
        <div className="absolute inset-12 rounded-full border border-dashed border-primary/50" />
      </div>

      <div className="pointer-events-none hidden md:block">
        <motion.div
          className="absolute top-32 left-[8%] flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <SiNetflix size={24} style={{ color: "#E50914" }} />
        </motion.div>
        <motion.div
          className="absolute top-48 right-[10%] flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <SiSpotify size={24} style={{ color: "#1DB954" }} />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-[12%] flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <SiApplemusic size={20} style={{ color: "#FC3C44" }} />
        </motion.div>
        <motion.div
          className="absolute bottom-36 right-[8%] flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <FiPlay size={20} style={{ color: "#0063E5" }} />
        </motion.div>
        <motion.div
          className="absolute top-64 left-[18%] flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <SiCanva size={18} style={{ color: "#00C4CC" }} />
        </motion.div>
        <motion.div
          className="absolute top-56 right-[16%] flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <FiTv size={18} style={{ color: "#1a1a2e" }} />
        </motion.div>
      </div>

      <motion.div className="relative z-10 mx-auto max-w-6xl px-5" style={{ y: textY, opacity }}>
        <div className="text-center">
          <motion.div
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary-light px-5 py-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: easeFluid }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">
              +2 000 membres — Sénégal, Congo, Gabon
            </span>
          </motion.div>

          <motion.h1
            className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-7xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: easeFluid }}
          >
            Partageons le prix de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">nos abonnements</span>
              <motion.span
                className="absolute bottom-1 left-0 z-0 h-4 w-full rounded-md bg-primary/15 md:bottom-2 md:h-5"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.65, delay: 0.5, ease: easeFluid }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 flex max-w-2xl flex-col gap-1.5 text-center text-lg leading-snug text-text-secondary md:gap-2 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: easeFluid }}
          >
            <span>
              Jusqu&apos;à <strong className="text-text">70 %</strong> moins cher en rejoignant un groupe.
            </span>
            <span>
              <strong className="text-text">Proposez votre abo</strong> pour rentabiliser vos places libres.
            </span>
            <span className="text-base text-text-muted md:text-lg">
              Rejoignez un groupe ou publiez le vôtre — mobile money, escrow.
            </span>
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.36, ease: easeFluid }}
          >
            <Link
              href={ROUTES.SIGNUP}
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-[transform,box-shadow,background-color] duration-300 ease-out hover:shadow-xl hover:bg-primary-hover hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2.5">
                Commencer gratuitement
                <svg className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
            <Link
              href={ROUTES.EXPLORE}
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3.5 text-base font-semibold text-text transition-all hover:border-primary hover:text-primary hover:bg-primary-light/50"
            >
              Voir les abonnements
            </Link>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 flex max-w-lg items-center justify-center divide-x divide-gray-200"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: easeFluid }}
          >
            <div className="px-6 text-center md:px-10">
              <AnimatedCounter
                target={70}
                suffix="%"
                duration={0.65}
                className="text-3xl font-extrabold text-gray-900 md:text-4xl"
              />
              <p className="mt-1 text-sm text-text-muted">d&apos;économies</p>
            </div>
            <div className="px-6 text-center md:px-10">
              <AnimatedCounter
                target={2}
                suffix="k+"
                duration={0.65}
                className="text-3xl font-extrabold text-gray-900 md:text-4xl"
              />
              <p className="mt-1 text-sm text-text-muted">membres actifs</p>
            </div>
            <div className="px-6 text-center md:px-10">
              <AnimatedCounter
                target={4.8}
                decimals={1}
                duration={0.65}
                className="text-3xl font-extrabold text-gray-900 md:text-4xl"
              />
              <p className="mt-1 text-sm text-text-muted">note de confiance</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
