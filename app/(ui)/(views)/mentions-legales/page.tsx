import type { Metadata } from "next";
import MentionsLegalesClient from "@/app/(ui)/(views)/mentions-legales/mentions-legales-client";

export const metadata: Metadata = {
    title: "Mentions légales",
    description: "Mentions légales de Députédex : éditeur, hébergement, propriété intellectuelle, licence des données et gestion des données personnelles.",
    alternates: { canonical: "/mentions-legales" },
    openGraph: {
        title: "Mentions légales | Députédex",
        description: "Mentions légales de Députédex : éditeur, hébergement, propriété intellectuelle, licence des données et gestion des données personnelles.",
        url: "/mentions-legales",
    },
};

export default function MentionsLegalesPage() {
    return <MentionsLegalesClient />;
}
