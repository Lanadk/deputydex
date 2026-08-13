import type { Metadata } from "next";
import GroupesPageClient from "@/app/(ui)/(views)/(db)/groupes/groupes-page-client";

export const metadata: Metadata = {
    title: "Groupes parlementaires",
    description: "Explorez les groupes parlementaires de l'Assemblée nationale, découvrez leurs membres, leurs présidents et leurs positions politiques.",
    alternates: { canonical: "/groupes" },
    openGraph: {
        title: "Groupes parlementaires | Députédex",
        description: "Explorez les groupes parlementaires de l'Assemblée nationale, découvrez leurs membres, leurs présidents et leurs positions politiques.",
        url: "/groupes",
    },
};

export default function GroupesPage() {
    return <GroupesPageClient />;
}
