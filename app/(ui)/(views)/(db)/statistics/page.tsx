import type { Metadata } from "next";
import StatisticsHubClient from "@/app/(ui)/(views)/(db)/statistics/statistics-hub-client";

export const metadata: Metadata = {
    title: "Statistiques",
    description: "Les grands chiffres de l'Assemblée nationale expliqués simplement, ou l'exploration complète des données : votes, scrutins, groupes parlementaires.",
    alternates: { canonical: "/statistics" },
    openGraph: {
        title: "Statistiques | Députédex",
        description: "Les grands chiffres de l'Assemblée nationale expliqués simplement, ou l'exploration complète des données : votes, scrutins, groupes parlementaires.",
        url: "/statistics",
    },
};

export default function StatisticsPage() {
    return <StatisticsHubClient />;
}
