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

export function FacturePdfButton({ facture }: { facture: FactureInfo }) {
  const [loading, setLoading] = useState(false);

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
        // fallback : ouvrir WhatsApp avec le message, sans fichier
        const phone = facture.client?.telephone?.replace(/\D/g, "") ?? "";
        const url = `https://wa.me/${phone ? phone : ""}?text=${encodeURIComponent(message)}`;
        // télécharger le PDF d'abord, puis ouvrir WhatsApp
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
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={telecharger} disabled={loading}>
        <Download className="h-4 w-4" />{loading ? "..." : "PDF"}
      </Button>
      <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebe57] text-white" onClick={partagerWhatsapp} disabled={loading}>
        <MessageCircle className="h-4 w-4" />{loading ? "..." : "WhatsApp"}
      </Button>
    </div>
  );
}
