import { Badge } from "@/components/ui/badge";
import type { StatutFacture, StatutRendezVous } from "@/types";

const statutFactureConfig: Record<StatutFacture, { label: string; variant: "success" | "info" | "warning" | "destructive" | "purple" }> = {
  payee:     { label: "Payée",     variant: "success" },
  envoyee:   { label: "Envoyée",   variant: "info" },
  brouillon: { label: "Brouillon", variant: "purple" },
  en_retard: { label: "En retard", variant: "destructive" },
};

const statutRdvConfig: Record<StatutRendezVous, { label: string; variant: "success" | "info" | "warning" | "destructive" | "purple" }> = {
  confirme:  { label: "Confirmé",  variant: "success" },
  en_attente:{ label: "En attente",variant: "warning" },
  annule:    { label: "Annulé",    variant: "destructive" },
  termine:   { label: "Terminé",   variant: "purple" },
};

export function StatutFactureBadge({ statut }: { statut: StatutFacture }) {
  const { label, variant } = statutFactureConfig[statut];
  return <Badge variant={variant}>{label}</Badge>;
}

export function StatutRdvBadge({ statut }: { statut: StatutRendezVous }) {
  const { label, variant } = statutRdvConfig[statut];
  return <Badge variant={variant}>{label}</Badge>;
}
