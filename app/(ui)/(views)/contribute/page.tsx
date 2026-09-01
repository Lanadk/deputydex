import type { Metadata } from "next";
import ContributeClient from "@/app/(ui)/(views)/contribute/contribute-client";

export const metadata: Metadata = {
    title: "Contribuer",
    description: "Le code de Députédex est disponible sous licence AGPL-3.0 sur deux dépôts GitHub : l'ETL qui calcule les données et le front/API qui les affiche. Découvrez comment contribuer.",
    alternates: { canonical: "/contribute" },
    openGraph: {
        title: "Contribuer | Députédex",
        description: "Le code de Députédex est disponible sous licence AGPL-3.0 sur deux dépôts GitHub : l'ETL qui calcule les données et le front/API qui les affiche. Découvrez comment contribuer.",
        url: "/contribute",
    },
};

export default function ContributePage() {
    return <ContributeClient />;
}
