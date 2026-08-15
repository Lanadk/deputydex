import type { Metadata } from "next";
import StatisticsPageClient from "@/app/(ui)/(views)/(db)/statistics/statistics-page-client";

export const metadata: Metadata = {
    title: "Statistiques",
    description: "Statistiques et visualisations sur l'activité de l'Assemblée nationale : votes, scrutins et dynamique des groupes parlementaires.",
    alternates: { canonical: "/statistics" },
    openGraph: {
        title: "Statistiques | Députédex",
        description: "Statistiques et visualisations sur l'activité de l'Assemblée nationale : votes, scrutins et dynamique des groupes parlementaires.",
        url: "/statistics",
    },
};

export default function StatisticsPage() {
    return <StatisticsPageClient />;
}
