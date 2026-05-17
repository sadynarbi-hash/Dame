"use client";

import { useState } from "react";
import { Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type FactureInfo = {
  numero: string;
  total_ttc: number;
  client: { nom: string; prenom: string; telephone: string | null } | null;
};

async function genererPdf(elementId: string, numero: string): Promise<Blob> {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const element = document.getElementById(elementId);
  if (!element) throw new Error("Élément introuvable");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  const imgH = pageW / ratio;

  let yPos = 0;
  let remaining = imgH;
  while (remaining > 0) {
    pdf.addImage(imgData, "JPEG", 0, -yPos, pageW, imgH);
    remaining -= pageH;
    yPos += pageH;
    if (remaining > 0) pdf.addPage();
  }

  return pdf.output("blob");
}

export function FacturePdfButton({ facture, couleur }: { facture: FactureInfo; couleur?: string }) {
  const [loading, setLoading] = useState(false);
  const bg = couleur ?? "#7c3aed";

  const telecharger = async () => {
    setLoading(true);
    try {
      const blob = await genererPdf("facture-content", facture.numero);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${facture.numero}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const partagerWhatsapp = async () => {
    setLoading(true);
    try {
      const blob = await genererPdf("facture-content", facture.numero);
      const file = new File([blob], `${facture.numero}.pdf`, { type: "application/pdf" });
      const montant = new Intl.NumberFormat("fr-FR").format(facture.total_ttc);
      const message = `Bonjour ${facture.client?.prenom ?? ""}, veuillez trouver ci-joint votre facture ${facture.numero} d'un montant de ${montant} FCFA. Merci pour votre confiance.`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: message });
      } else {
        const phone = facture.client?.telephone?.replace(/\D/g, "") ?? "";
        const url = `https://wa.me/${phone || ""}?text=${encodeURIComponent(message)}`;
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = `${facture.numero}.pdf`;
        a.click();
        URL.revokeObjectURL(dlUrl);
        setTimeout(() => window.open(url, "_blank"), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={partagerWhatsapp}
        disabled={loading}
        className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
        style={{ backgroundColor: bg }}
      >
        <MessageCircle className="h-5 w-5" />
        {loading ? "Génération en cours..." : "Envoyer la facture"}
      </button>
      <Button variant="outline" size="sm" onClick={telecharger} disabled={loading} className="w-full">
        <Download className="h-4 w-4" />Télécharger PDF
      </Button>
    </div>
  );
}
