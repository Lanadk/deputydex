import type { Metadata } from "next";

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
    return (
        <div>
            <main>
                <p></p>
            </main>
        </div>
    );
}
