import type { Metadata } from "next";
import LegislaturesPageClient from "@/app/(ui)/(views)/(db)/legislatures/legislatures-page-client";

const description = "Ce qu'est une législature, la chronologie des gouvernements et des présidences, et l'organigramme de l'exécutif et de l'Assemblée nationale.";

export const metadata: Metadata = {
    title: "Législatures",
    description,
    alternates: { canonical: "/legislatures" },
    openGraph: { title: "Législatures | Députédex", description, url: "/legislatures" },
};

export default function LegislaturesPage() {
    return <LegislaturesPageClient />;
}
