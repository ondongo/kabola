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
    <span className="group inline-flex items-center gap-2.5 whitespace-nowrap px-2 transition-all hover:scale-105">
      <ServiceIconInline name={name} size={22} />
      <span className="text-lg font-bold text-gray-300 transition-colors group-hover:text-gray-600">
        {name}
      </span>
    </span>
  );
}

export default function BrandMarquee() {
  return (
    <section className="bg-transparent py-8 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-text-muted">
          Les abonnements les plus proposés et rejoints
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex items-center gap-x-10 animate-marquee hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex shrink-0 items-center gap-x-10">
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
