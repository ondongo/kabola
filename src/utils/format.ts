import { CURRENCY_SYMBOL, TRUST_LEVELS } from "@/constants";

export function formatPrice(amount: number, currency?: string): string {
  const symbol = currency || CURRENCY_SYMBOL;
  return `${amount.toLocaleString("fr-FR")} ${symbol}`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return formatShortDate(date);
}

export function getTrustLevel(score: number) {
  return (
    TRUST_LEVELS.find((l) => score >= l.min && score <= l.max) ??
    TRUST_LEVELS[0]
  );
}

export function getAvailableSlots(
  totalSlots: number,
  filledSlots: number,
): number {
  return Math.max(0, totalSlots - filledSlots);
}

export function calculateSavings(
  originalPrice: number,
  sharedPrice: number,
): number {
  return Math.max(0, originalPrice - sharedPrice);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
