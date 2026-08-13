import type { Metadata } from "next";
import HomeClient from "@/app/home-client";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/app/_shared/seo/seo.config";

export const metadata: Metadata = {
    title: {
        absolute: DEFAULT_TITLE,
    },
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        url: "/",
    },
};

export default function Home() {
    return <HomeClient />;
}
