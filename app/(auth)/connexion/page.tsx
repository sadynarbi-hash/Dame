"use client";

import { useState, useTransition } from "react";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { signIn, signUp } from "@/lib/actions/auth";

export default function ConnexionPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (mode === "login") {
        const result = await signIn(formData);
        if (result?.error) setError(result.error);
      } else {
        const result = await signUp(formData);
        if (result && "error" in result) setError(result.error ?? null);
        else if (result && "success" in result) setSuccess(result.success);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Walima Techno</h1>
          <p className="text-purple-300 text-sm mt-1">Gestion professionnelle de votre salon</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{mode === "login" ? "Connexion" : "Créer un compte"}</CardTitle>
            <CardDescription>
              {mode === "login" ? "Entrez vos identifiants pour accéder à votre espace" : "Créez votre compte salon gratuit"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="nom_salon">Nom du salon</Label>
                  <Input id="nom_salon" name="nom_salon" placeholder="Salon Beauté Africaine" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="vous@salon.sn" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" minLength={6} required />
              </div>

              {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>}
              {success && <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">{success}</div>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
              </Button>
              <button type="button" className="text-xs text-muted-foreground hover:underline" onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(null); setSuccess(null); }}>
                {mode === "login" ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
