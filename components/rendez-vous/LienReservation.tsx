"use client";

import { useState } from "react";
import { Link2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LienReservation({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const lien = `${baseUrl}/prise-rdv/${userId}`;

  const copier = async () => {
    await navigator.clipboard.writeText(lien);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-wrap items-center gap-3">
      <Link2 className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Lien de réservation en ligne</p>
        <p className="text-xs text-muted-foreground truncate">{lien}</p>
      </div>
      <Button size="sm" variant="outline" onClick={copier} className="shrink-0">
        {copied ? <><Check className="h-3.5 w-3.5" />Copié !</> : <><Copy className="h-3.5 w-3.5" />Copier le lien</>}
      </Button>
    </div>
  );
}
