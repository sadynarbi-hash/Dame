"use client";

import { useState } from "react";
import { Link2, Copy, Check, MessageCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function LienReservation({ userId, nomSalon }: { userId: string; nomSalon: string }) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "";
  const lien = `${baseUrl}/prise-rdv/${userId}`;

  const copier = async () => {
    await navigator.clipboard.writeText(lien);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const partagerWhatsapp = () => {
    const message = `Bonjour ! Prenez rendez-vous en ligne avec ${nomSalon} ici 👇\n${lien}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(lien)}`;

  return (
    <>
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary shrink-0" />
          <p className="text-sm font-semibold">Lien de réservation en ligne</p>
        </div>

        {/* Lien affiché */}
        <div className="bg-muted/50 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex-1 break-all">{lien}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={copier} className="flex-1">
            {copied
              ? <><Check className="h-3.5 w-3.5 text-green-600" />Copié !</>
              : <><Copy className="h-3.5 w-3.5" />Copier</>}
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-[#25D366] hover:bg-[#1ebe57] text-white"
            onClick={partagerWhatsapp}
          >
            <MessageCircle className="h-3.5 w-3.5" />Envoyer via WhatsApp
          </Button>
          <Button size="sm" variant="outline" onClick={() => setQrOpen(true)}>
            <QrCode className="h-3.5 w-3.5" />QR Code
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Partagez ce lien à vos clients pour qu&apos;ils prennent rendez-vous sans vous appeler.
        </p>
      </div>

      {/* Dialog QR Code */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-xs text-center">
          <DialogHeader>
            <DialogTitle>QR Code de réservation</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR Code" className="rounded-xl border shadow w-56 h-56" />
            <p className="text-xs text-muted-foreground px-2">
              Affichez ce QR code dans votre salon — le client le scanne et arrive directement sur le formulaire de RDV.
            </p>
            <Button variant="outline" size="sm" onClick={() => { const a = document.createElement("a"); a.href = qrUrl; a.download = "qr-rdv.png"; a.click(); }}>
              Télécharger le QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
