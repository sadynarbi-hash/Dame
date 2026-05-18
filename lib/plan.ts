export type Plan = "starter" | "business";

export const PLAN_LIMITS = {
  starter: { factures_mois: 100, membres_max: 0, stock_rapports: false },
  business: { factures_mois: Infinity, membres_max: 5, stock_rapports: true },
} as const;

export function getEffectivePlan(
  statut: string | null,
  plan: string | null,
  trialEndsAt: string | null
): Plan {
  // Trial actif = accès Business complet
  if (statut === "trial" && trialEndsAt && new Date(trialEndsAt) > new Date()) return "business";
  if (plan === "business") return "business";
  return "starter";
}
