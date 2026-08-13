import type { Metadata } from "next";
import AboutUsClient from "@/app/(ui)/(views)/about-us/about-us-client";

export const metadata: Metadata = {
    title: "À propos",
    description: "Découvrez le projet Députédex, sa mission de neutralité et de transparence, et les personnes qui le construisent.",
    alternates: { canonical: "/about-us" },
    openGraph: {
        title: "À propos | Députédex",
        description: "Découvrez le projet Députédex, sa mission de neutralité et de transparence, et les personnes qui le construisent.",
        url: "/about-us",
    },
};

export default function AboutUsPage() {
    return <AboutUsClient />;
}
