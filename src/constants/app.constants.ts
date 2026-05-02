export const APP_NAME = "Kabola";
export const APP_TAGLINE =
  "Rejoignez un groupe ou proposez votre abo. Économisez, rentabilisez.";
export const APP_DESCRIPTION =
  "Au Sénégal : payez moins en rejoignant un abonnement partagé, ou proposez le vôtre et rentabilisez les places libres — mobile money, escrow et profils vérifiés.";

export const CURRENCY = "XOF";
export const CURRENCY_SYMBOL = "FCFA";
export const DEFAULT_COUNTRY = "SN";

/** Commission plateforme sur chaque paiement (pourcentage). */
export const PLATFORM_FEE_PERCENT = 10;
/** Frais fixes optionnels par transaction (FCFA), 0 par défaut pour rester accessible. */
export const PLATFORM_FIXED_FEE_XOF = 0;

export const MIN_TRUST_SCORE = 0;
export const MAX_TRUST_SCORE = 100;
export const DEFAULT_TRUST_SCORE = 50;

export const COLLECTIONS = {
  users: "users",
  subscriptions: "subscriptions",
  participations: "participations",
  payments: "payments",
  invoices: "invoices",
  notifications: "notifications",
  /** Dernière lecture des messages par utilisateur et abonnement */
  messageReads: "messageReads",
  trustEvents: "trustEvents",
  /** Sous-collection : subscriptions/{id}/messages */
  messages: "messages",
} as const;

export const STORAGE_PATHS = {
  invoices: (uid: string, subscriptionId: string, fileName: string) =>
    `invoices/${uid}/${subscriptionId}/${fileName}`,
} as const;

export const PAYMENT_METHODS = [
  { id: "WAVE", label: "Wave", icon: "wave" },
  { id: "ORANGE_MONEY", label: "Orange Money", icon: "orange-money" },
  { id: "FREE_MONEY", label: "Free Money", icon: "free-money" },
] as const;

export const SERVICE_CATEGORIES = [
  { id: "VIDEO", label: "Films & Séries", icon: "FiFilm" },
  { id: "MUSIC", label: "Musique", icon: "FiMusic" },
  { id: "VPN", label: "Sécurité & VPN", icon: "FiShield" },
  { id: "PRODUCTIVITY", label: "Productivité", icon: "FiBriefcase" },
  { id: "GAMING", label: "Jeux vidéo", icon: "FiPlay" },
  { id: "DESIGN", label: "Design", icon: "FiPenTool" },
  { id: "CLOUD", label: "Cloud", icon: "FiCloud" },
  { id: "EDUCATION", label: "Éducation", icon: "FiBookOpen" },
  { id: "OTHER", label: "Autre", icon: "FiGrid" },
] as const;

export const TRUST_LEVELS = [
  { min: 0, max: 30, label: "Nouveau", color: "text-gray-500" },
  { min: 31, max: 60, label: "Fiable", color: "text-warning" },
  { min: 61, max: 85, label: "Très fiable", color: "text-success" },
  { min: 86, max: 100, label: "Excellent", color: "text-dark-brand" },
] as const;

export const POPULAR_SERVICES = [
  {
    name: "Netflix Premium",
    slug: "netflix-premium",
    category: "VIDEO" as const,
    monthlyPrice: 6500,
    maxSlots: 5,
    pricePerSlot: 1950,
  },
  {
    name: "Spotify Famille",
    slug: "spotify-famille",
    category: "MUSIC" as const,
    monthlyPrice: 4500,
    maxSlots: 6,
    pricePerSlot: 1200,
  },
  {
    name: "IPTV",
    slug: "iptv",
    category: "VIDEO" as const,
    monthlyPrice: 5000,
    maxSlots: 4,
    pricePerSlot: 1500,
  },
  {
    name: "Apple Music",
    slug: "apple-music",
    category: "MUSIC" as const,
    monthlyPrice: 7000,
    maxSlots: 5,
    pricePerSlot: 2000,
  },
  {
    name: "Canva Pro Team",
    slug: "canva-pro-team",
    category: "DESIGN" as const,
    monthlyPrice: 8000,
    maxSlots: 5,
    pricePerSlot: 2500,
  },
  {
    name: "Canal+",
    slug: "canal-plus",
    category: "VIDEO" as const,
    monthlyPrice: 10000,
    maxSlots: 3,
    pricePerSlot: 4000,
  },
] as const;
