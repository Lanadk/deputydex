import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Députédex",
    description: "Explorez l'intégralité des députés de l'Assemblée nationale : mandats, groupes, activité parlementaire et votes.",
    alternates: { canonical: "/deputydex" },
    openGraph: {
        title: "Députédex",
        description: "Explorez l'intégralité des députés de l'Assemblée nationale : mandats, groupes, activité parlementaire et votes.",
        url: "/deputydex",
    },
};

export default function DeputydexPage() {
    return (
        <div>
            <main>
                <p></p>
            </main>
        </div>
    );
}
