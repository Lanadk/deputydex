import type { Metadata } from "next";
import ContributeClient from "@/app/(ui)/(views)/contribute/contribute-client";

export const metadata: Metadata = {
    title: "Contribuer",
    description: "Députédex est un projet open source réparti sur deux dépôts GitHub : l'ETL qui calcule les données et le front/API qui les affiche. Découvrez comment contribuer.",
    alternates: { canonical: "/contribute" },
    openGraph: {
        title: "Contribuer | Députédex",
        description: "Députédex est un projet open source réparti sur deux dépôts GitHub : l'ETL qui calcule les données et le front/API qui les affiche. Découvrez comment contribuer.",
        url: "/contribute",
    },
};

export default function ContributePage() {
    return <ContributeClient />;
}
