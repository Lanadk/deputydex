import type { Metadata } from "next";
import ChiffresClesPageClient from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/chiffres-cles-page-client";

export const metadata: Metadata = {
    title: "Chiffres clés — Statistiques",
    description: "Les grands chiffres de l'Assemblée nationale, expliqués : âge, parité, cohésion des groupes, participation...",
    alternates: { canonical: "/statistics/chiffres-cles" },
    openGraph: {
        title: "Chiffres clés — Statistiques | Députédex",
        description: "Les grands chiffres de l'Assemblée nationale, expliqués : âge, parité, cohésion des groupes, participation...",
        url: "/statistics/chiffres-cles",
    },
};

export default function ChiffresClesPage() {
    return <ChiffresClesPageClient />;
}
