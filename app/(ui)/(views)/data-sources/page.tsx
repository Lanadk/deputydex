import type { Metadata } from "next";
import DataSourcesClient from "@/app/(ui)/(views)/data-sources/data-sources-client";

export const metadata: Metadata = {
    title: "Sources de données",
    description: "Les données du Députédex proviennent exclusivement de sources publiques et officielles de l'Assemblée nationale, mises à jour régulièrement.",
    alternates: { canonical: "/data-sources" },
    openGraph: {
        title: "Sources de données | Députédex",
        description: "Les données du Députédex proviennent exclusivement de sources publiques et officielles de l'Assemblée nationale, mises à jour régulièrement.",
        url: "/data-sources",
    },
};

export default function DataSourcesPage() {
    return <DataSourcesClient />;
}
