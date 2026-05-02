import { MAX_TRUST_SCORE, MIN_TRUST_SCORE, TRUST_LEVELS } from "@/constants/app.constants";

export function clampTrustScore(score: number): number {
  return Math.min(MAX_TRUST_SCORE, Math.max(MIN_TRUST_SCORE, Math.round(score)));
}

export function trustLabelForScore(score: number): string {
  const row = TRUST_LEVELS.find((t) => score >= t.min && score <= t.max);
  return row?.label ?? "—";
}
