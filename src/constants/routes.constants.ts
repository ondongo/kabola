/** URL d’accueil avec ouverture de la modal de connexion (`?login=1`). */
export function buildLoginHref(next?: string): string {
  const p = new URLSearchParams();
  p.set("login", "1");
  if (next) p.set("next", next);
  return `/?${p.toString()}`;
}

export const ROUTES = {
  HOME: "/",
  /** @deprecated Utiliser `buildLoginHref()` — la connexion se fait en modal sur `/`. */
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SUBSCRIPTIONS_BROWSE: "/subscriptions",
  SUBSCRIPTIONS_MINE: "/subscriptions?view=mine",
  PAYMENTS: "/payments",
  PROFILE: "/profile",
  PROFILE_VERIFICATION: "/profile/verification",
  TRUST: "/trust",
  CHARTER: "/charte",
  SUBSCRIPTION_DETAIL: (id: string) => `/subscriptions/${id}` as const,
  /** Fil de discussion lié à un abonnement partagé */
  MESSAGES: "/messages",
  MESSAGES_THREAD: (id: string) => `/messages/${id}` as const,
  /** Alias historique — même URL que MESSAGES_THREAD */
  SUBSCRIPTION_MESSAGES: (id: string) => `/messages/${id}` as const,
  NOTIFICATIONS: "/notifications",
  CREATE_SUBSCRIPTION: "/subscriptions/create",
} as const;
