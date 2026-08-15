import type { Metadata } from "next";
import AvancePageClient from "@/app/(ui)/(views)/(db)/statistics/avance/avance-page-client";

export const metadata: Metadata = {
    title: "Mode avancé — Statistiques",
    description: "Explore, compare et exporte toutes les statistiques de l'Assemblée nationale : votes, scrutins et dynamique des groupes parlementaires.",
    alternates: { canonical: "/statistics/avance" },
    openGraph: {
        title: "Mode avancé — Statistiques | Députédex",
        description: "Explore, compare et exporte toutes les statistiques de l'Assemblée nationale : votes, scrutins et dynamique des groupes parlementaires.",
        url: "/statistics/avance",
    },
};

export default function StatisticsAvancePage() {
    return <AvancePageClient />;
}
