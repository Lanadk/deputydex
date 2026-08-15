import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ThemePageClient from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/[theme]/theme-page-client";
import { findKeyFigureTheme } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ theme: string }>;
}): Promise<Metadata> {
    const { theme: slug } = await params;
    const theme = findKeyFigureTheme(slug);
    if (!theme) return {};

    return {
        title: `${theme.title} — Chiffres clés`,
        description: theme.teaser,
        alternates: { canonical: `/statistics/chiffres-cles/${slug}` },
        openGraph: {
            title: `${theme.title} — Chiffres clés | Députédex`,
            description: theme.teaser,
            url: `/statistics/chiffres-cles/${slug}`,
        },
    };
}

export default async function ChiffresClesThemePage({
    params,
}: {
    params: Promise<{ theme: string }>;
}) {
    const { theme: slug } = await params;
    if (!findKeyFigureTheme(slug)) notFound();

    return <ThemePageClient slug={slug} />;
}
