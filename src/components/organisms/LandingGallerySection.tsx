"use client";

import Image from "next/image";
import { LANDING_IMAGES } from "@/constants/landing-images";
import ScrollReveal from "@/components/atoms/ScrollReveal";

export default function LandingGallerySection() {
  return (
    <section
      id="galerie"
      className="bg-primary-light py-16 md:py-24"
      aria-label="Galerie photos"
    >
      <div className="mx-auto max-w-6xl px-5">
        <ScrollReveal variant="fade-up">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              La communauté Kabola
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-text md:text-3xl">
              Partager, c&apos;est économiser ensemble
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-text-secondary">
              Des moments en famille, entre amis — les abonnements au meilleur prix.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.08}>
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-4xl bg-white shadow-lg ring-1 ring-black/5">
            <div className="relative aspect-4/5 w-full md:aspect-4/5">
              <Image
                src={LANDING_IMAGES.heroFamily}
                alt="Famille sur un canapé, moment de détente devant un écran"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42rem"
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {LANDING_IMAGES.lifestyle.map((src, i) => (
            <ScrollReveal key={src} variant="fade-up" delay={0.06 * (i + 1)}>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-accent/20 shadow-md ring-1 ring-black/5">
                <Image
                  src={src}
                  alt={`Kabola — scène de vie ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
