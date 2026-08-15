import type { Metadata } from "next";
import DeputydexPageClient from "@/app/(ui)/(views)/deputydex/deputydex-page-client";

export const metadata: Metadata = {
    title: "Députédex",
    description: "Explorez l'intégralité des députés français de l'Assemblée nationale : mandats, groupes, activité " +
        "parlementaire, votes ainsi que leurs statistiques",
    alternates: { canonical: "/deputydex" },
    openGraph: {
        title: "Députédex",
        description: "Explorez l'intégralité des députés français de l'Assemblée nationale : mandats, groupes, " +
            "activité parlementaire, votes et leurs statistiques.",
        url: "/deputydex",
    },
};

export default function DeputydexPage() {
    return <DeputydexPageClient />;
}
