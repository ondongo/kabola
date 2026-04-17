"use client";

import { ServiceIconInline } from "@/components/atoms/ServiceIcon";

const BRANDS = [
  "Netflix",
  "Spotify",
  "Apple Music",
  "IPTV",
  "Canal+",
  "Canva Pro",
  "Deezer",
  "Figma",
  "NordVPN",
  "Notion",
  "HBO",
];

function BrandItem({ name }: { name: string }) {
  return (
    <span className="group inline-flex items-center gap-1.5 whitespace-nowrap px-1.5 transition-all hover:scale-105 sm:gap-2.5 sm:px-2">
      <span className="sm:hidden">
        <ServiceIconInline name={name} size={18} />
      </span>
      <span className="hidden sm:inline">
        <ServiceIconInline name={name} size={22} />
      </span>
      <span className="hidden text-base font-bold text-gray-300 transition-colors group-hover:text-gray-600 sm:inline sm:text-lg">
        {name}
      </span>
    </span>
  );
}

export default function BrandMarquee() {
  return (
    <section className="overflow-hidden bg-transparent py-5 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <p className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-widest text-text-muted sm:mb-6 sm:text-xs">
          Les abonnements les plus proposés et rejoints
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex items-center gap-x-6 animate-marquee hover:[animation-play-state:paused] sm:gap-x-10">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex shrink-0 items-center gap-x-6 sm:gap-x-10">
              {BRANDS.map((name) => (
                <BrandItem key={`${setIdx}-${name}`} name={name} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
