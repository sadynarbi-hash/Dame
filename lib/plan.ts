export type Plan = "gratuit" | "starter" | "business";

export const PLAN_LIMITS = {
  gratuit: { factures_mois: 5, membres_max: 0, stock_rapports: false },
  starter: { factures_mois: 100, membres_max: 0, stock_rapports: false },
  business: { factures_mois: Infinity, membres_max: 5, stock_rapports: true },
} as const;

export const PLAN_LABELS: Record<Plan, string> = {
  gratuit: "Gratuit",
  starter: "Starter",
  business: "Business",
};

export function getEffectivePlan(
  statut: string | null,
  plan: string | null,
  trialEndsAt: string | null
): Plan {
  // Trial actif = accès Business complet
  if (statut === "trial" && trialEndsAt && new Date(trialEndsAt) > new Date()) return "business";
  if (plan === "business") return "business";
  if (plan === "starter") return "starter";
  return "gratuit";
}
