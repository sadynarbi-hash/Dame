"use client";

import { useState, useTransition, useRef } from "react";
import { Save, Building2, Mail, Phone, Globe, FileText, Upload, X, Palette, Image, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateEntreprise, uploadLogo, deleteLogo } from "@/lib/actions/entreprise";
import type { Database } from "@/types/supabase";

type EntrepriseRow = Database["public"]["Tables"]["entreprises"]["Row"];

const COULEURS_PRESET = [
  { label: "Violet", value: "#8B5CF6" },
  { label: "Rose", value: "#EC4899" },
  { label: "Orange", value: "#F97316" },
  { label: "Vert", value: "#10B981" },
  { label: "Bleu", value: "#3B82F6" },
  { label: "Rouge", value: "#EF4444" },
  { label: "Or", value: "#F59E0B" },
  { label: "Teal", value: "#14B8A6" },
];

export function ParametresClient({ initialEntreprise }: { initialEntreprise: EntrepriseRow | null }) {
  const defaultForm = {
    nom: initialEntreprise?.nom ?? "",
    adresse: initialEntreprise?.adresse ?? "",
    telephone: initialEntreprise?.telephone ?? "",
    email: initialEntreprise?.email ?? "",
    siteWeb: initialEntreprise?.site_web ?? "",
    siret: initialEntreprise?.siret ?? "",
    numeroTva: initialEntreprise?.numero_tva ?? "",
    rib: initialEntreprise?.rib ?? "",
    mentionsLegales: initialEntreprise?.mentions_legales ?? "",
    couleurPrincipale: initialEntreprise?.couleur_principale ?? "#8B5CF6",
  };

  const [form, setForm] = useState(defaultForm);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialEntreprise?.logo ?? null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploadPending, startUploadTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateEntreprise(form);
      if (result?.error) { setError(result.error); return; }
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
  };

  const handleUploadLogo = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    startUploadTransition(async () => {
      const result = await uploadLogo(formData);
      if (result?.error) { setError(result.error); return; }
      setError(null);
      if (result.url) setLogoUrl(result.url);
      setLogoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const handleDeleteLogo = () => {
    startDeleteTransition(async () => {
      const result = await deleteLogo();
      if (result?.error) { setError(result.error); return; }
      setError(null);
      setLogoUrl(null);
      setLogoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const cancelPreview = () => {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayedLogo = logoPreview ?? logoUrl;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Image className="h-5 w-5" />Logo du salon</CardTitle>
          <CardDescription>Affiché sur vos factures (JPG, PNG, WEBP, SVG — max 2 Mo)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              {displayedLogo ? (
                <div className="relative w-24 h-24 rounded-xl border bg-muted overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={displayedLogo} alt="Logo" className="w-full h-full object-contain p-1" />
                  {logoPreview && (
                    <span className="absolute top-1 right-1 text-[10px] bg-amber-500 text-white px-1 rounded">
                      Aperçu
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                  <Upload className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                id="logo-input"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {logoUrl ? "Changer le logo" : "Choisir un logo"}
                </Button>

                {logoPreview && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUploadLogo}
                      disabled={isUploadPending}
                    >
                      {isUploadPending ? "Envoi..." : "Enregistrer le logo"}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={cancelPreview}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}

                {logoUrl && !logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteLogo}
                    disabled={isDeletePending}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                    {isDeletePending ? "Suppression..." : "Supprimer"}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommandé : fond transparent, format carré ou horizontal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Couleur principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Couleur principale</CardTitle>
          <CardDescription>Utilisée pour l&apos;accent de vos factures et documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {COULEURS_PRESET.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setForm(f => ({ ...f, couleurPrincipale: c.value }))}
                className="w-9 h-9 rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: c.value,
                  borderColor: form.couleurPrincipale === c.value ? "#0f172a" : "transparent",
                  boxShadow: form.couleurPrincipale === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Label className="shrink-0 text-sm">Couleur personnalisée</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.couleurPrincipale}
                onChange={(e) => setForm(f => ({ ...f, couleurPrincipale: e.target.value }))}
                className="w-9 h-9 rounded cursor-pointer border border-input"
              />
              <span className="text-sm font-mono text-muted-foreground">
                {form.couleurPrincipale.toUpperCase()}
              </span>
            </div>
          </div>
          <div
            className="h-2 rounded-full"
            style={{ background: `linear-gradient(to right, ${form.couleurPrincipale}33, ${form.couleurPrincipale})` }}
          />
        </CardContent>
      </Card>

      {/* Informations entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Informations de l&apos;entreprise</CardTitle>
          <CardDescription>Ces informations apparaissent sur vos factures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom du salon *</Label>
            <Input value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Adresse *</Label>
            <Textarea value={form.adresse} onChange={(e) => setForm(f => ({ ...f, adresse: e.target.value }))} rows={2} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Téléphone</Label>
              <Input value={form.telephone} onChange={(e) => setForm(f => ({ ...f, telephone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Site web</Label>
            <Input value={form.siteWeb} onChange={(e) => setForm(f => ({ ...f, siteWeb: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      {/* Informations légales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Informations légales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>NINEA</Label>
              <Input value={form.siret} onChange={(e) => setForm(f => ({ ...f, siret: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Numéro TVA</Label>
              <Input value={form.numeroTva} onChange={(e) => setForm(f => ({ ...f, numeroTva: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mentions légales (pied de facture)</Label>
            <Textarea value={form.mentionsLegales} onChange={(e) => setForm(f => ({ ...f, mentionsLegales: e.target.value }))} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Gestion des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" />Utilisateurs du salon</CardTitle>
          <CardDescription>Ajoutez des membres à votre équipe et contrôlez leurs accès</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/parametres/utilisateurs">Gérer les utilisateurs →</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className={saved ? "bg-green-600 hover:bg-green-700" : ""}
          style={!saved && !isPending ? { backgroundColor: form.couleurPrincipale } : undefined}
        >
          <Save className="h-4 w-4" />
          {saved ? "Enregistré !" : isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
