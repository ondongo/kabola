/** Pastel chips (style type marketplace) — fond + texte pour les filtres catégorie. */
export const CATEGORY_CHIP_STYLES: Record<
  string,
  { active: string; inactive: string }
> = {
  ALL: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200/80",
  },
  VIDEO: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-violet-100 text-neutral-900 hover:bg-violet-200/80",
  },
  MUSIC: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-sky-100 text-neutral-900 hover:bg-sky-200/80",
  },
  VPN: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-cyan-100 text-neutral-900 hover:bg-cyan-200/80",
  },
  PRODUCTIVITY: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-slate-100 text-neutral-900 hover:bg-slate-200/80",
  },
  GAMING: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-emerald-100 text-neutral-900 hover:bg-emerald-200/80",
  },
  DESIGN: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-fuchsia-100 text-neutral-900 hover:bg-fuchsia-200/80",
  },
  CLOUD: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-amber-100 text-neutral-900 hover:bg-amber-200/80",
  },
  EDUCATION: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-rose-100 text-neutral-900 hover:bg-rose-200/80",
  },
  OTHER: {
    active: "bg-neutral-900 text-white",
    inactive: "bg-stone-100 text-neutral-900 hover:bg-stone-200/80",
  },
};
