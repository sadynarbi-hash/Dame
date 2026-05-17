import { format, formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const TVA_TAUX = 18;

export function formatFCFA(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy", { locale: fr });
}

export function formatDateLong(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d MMMM yyyy", { locale: fr });
}

export function formatMois(mois: number, annee: number): string {
  return format(new Date(annee, mois - 1, 1), "MMMM yyyy", { locale: fr });
}

export function formatDateRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

export function formatAnniversaire(date: string): string {
  const parts = date.split("-");
  if (parts.length < 3) return date;
  const mois = parts[parts.length - 2];
  const jour = parts[parts.length - 1];
  return `${jour}/${mois}`;
}

export function formatHeure(heure: string): string {
  return heure.slice(0, 5);
}

export function calculerTTC(ht: number, tva = TVA_TAUX): number {
  return Math.round(ht * (1 + tva / 100));
}

export function calculerHT(ttc: number, tva = TVA_TAUX): number {
  return Math.round(ttc / (1 + tva / 100));
}

export function calculerMontantTva(ht: number, tva = TVA_TAUX): number {
  return Math.round(ht * (tva / 100));
}

export function genererNumeroFacture(count: number): string {
  const annee = new Date().getFullYear();
  return `FAC-${annee}-${String(count).padStart(4, "0")}`;
}
