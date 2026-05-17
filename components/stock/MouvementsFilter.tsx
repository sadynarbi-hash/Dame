"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function MouvementsFilter({ from, to }: { from: string; to: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/stock/mouvements?${params.toString()}`);
  }, [router, searchParams]);

  const reset = () => router.push("/stock/mouvements");

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs">Du</Label>
        <Input type="date" className="h-8 text-sm w-36" value={from} onChange={(e) => update("from", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Au</Label>
        <Input type="date" className="h-8 text-sm w-36" value={to} onChange={(e) => update("to", e.target.value)} />
      </div>
      {(from || to) && (
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={reset}>Réinitialiser</Button>
      )}
    </div>
  );
}
