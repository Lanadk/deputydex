import type { Metadata } from "next";
import ScrutinsPageClient from "@/app/(ui)/(views)/(db)/scrutins/scrutins-page-client";

const description = "Les scrutins de l'Assemblée nationale : résultat de chaque vote et position de chaque groupe et de chaque député.";

export const metadata: Metadata = {
    title: "Scrutins",
    description,
    alternates: { canonical: "/scrutins" },
    openGraph: { title: "Scrutins | Députédex", description, url: "/scrutins" },
};

export default function ScrutinsPage() {
    return <ScrutinsPageClient />;
}
