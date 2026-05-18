"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateEntreprise(data: {
  nom?: string; adresse?: string; telephone?: string; email?: string;
  siteWeb?: string; siret?: string; numeroTva?: string; rib?: string;
  mentionsLegales?: string; couleurPrincipale?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("entreprises").update({
    nom: data.nom, adresse: data.adresse, telephone: data.telephone,
    email: data.email, site_web: data.siteWeb, siret: data.siret,
    numero_tva: data.numeroTva, rib: data.rib, mentions_legales: data.mentionsLegales,
    couleur_principale: data.couleurPrincipale,
  }).eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/parametres");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function uploadLogo(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const file = formData.get("logo") as File;
  if (!file || file.size === 0) return { error: "Aucun fichier sélectionné" };
  if (file.size > 2 * 1024 * 1024) return { error: "Le logo doit faire moins de 2 Mo" };
  const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  if (!(file.type in MIME_TO_EXT)) {
    return { error: "Format non supporté (JPG, PNG, WEBP uniquement)" };
  }

  const ext = MIME_TO_EXT[file.type];
  const path = `${user.id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: "Erreur lors de l'envoi du fichier" };

  const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);

  const { error } = await supabase.from("entreprises")
    .update({ logo: publicUrl })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/parametres");
  revalidatePath("/", "layout");
  return { success: true, url: publicUrl };
}

export async function deleteLogo() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: entreprise } = await supabase
    .from("entreprises").select("logo").eq("user_id", user.id).single();

  if (entreprise?.logo) {
    const path = `${user.id}/logo.${entreprise.logo.split(".").pop()?.split("?")[0]}`;
    await supabase.storage.from("logos").remove([path]);
  }

  const { error } = await supabase.from("entreprises")
    .update({ logo: null })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/parametres");
  revalidatePath("/", "layout");
  return { success: true };
}
