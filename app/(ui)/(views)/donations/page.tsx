import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Faire un don",
    description: "Soutenez le développement de Députédex, un projet indépendant qui rend accessibles les données publiques de l'Assemblée nationale.",
    alternates: { canonical: "/donations" },
    openGraph: {
        title: "Faire un don | Députédex",
        description: "Soutenez le développement de Députédex, un projet indépendant qui rend accessibles les données publiques de l'Assemblée nationale.",
        url: "/donations",
    },
};

export default function DonationPage() {
    return (
        <div>
            <main>
                <p></p>
            </main>
        </div>
    );
}
