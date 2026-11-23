import type { Metadata } from "next";
import HomeClient from "@/app/home-client";
import { getHomeData } from "@/app/home-data";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/app/_shared/seo/seo.config";

export const metadata: Metadata = {
    title: {
        absolute: DEFAULT_TITLE,
    },
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        url: "/",
    },
};

// Rendu à chaque requête (les lectures passent par le cache serveur) : jamais
// pré-rendu au build, qui n'a pas accès à la base.
export const dynamic = "force-dynamic";

/**
 * Accueil : toutes ses données sont lues ici, côté serveur, en un seul passage
 * (`getHomeData`) — la page arrive remplie (référencement) et le navigateur ne
 * fait aucun appel API au chargement. Un bloc en erreur côté serveur est
 * rechargé par le client.
 */
export default async function Home() {
    const data = await getHomeData();
    return <HomeClient initial={data} />;
}
