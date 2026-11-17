import type { Metadata } from "next";
import HemicyclePageClient from "@/app/(ui)/(views)/(db)/hemicycle/hemicycle-page-client";

const DESCRIPTION =
    "L'hémicycle de l'Assemblée nationale, groupe par groupe : répartition des sièges, effectifs et " +
    "présidences des groupes parlementaires.";

export const metadata: Metadata = {
    title: "L'hémicycle",
    description: DESCRIPTION,
    alternates: { canonical: "/hemicycle" },
    openGraph: {
        title: "L'hémicycle",
        description: DESCRIPTION,
        url: "/hemicycle",
    },
};

export default function HemicyclePage() {
    return <HemicyclePageClient />;
}
