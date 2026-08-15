"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { SectionBlockLoader } from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { findKeyFigureTheme } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

/**
 * Rendu d'UN thème "Chiffres clés". Reçoit `slug` (sérialisable), pas le
 * `KeyFigureTheme` lui-même : celui-ci porte une référence de composant
 * (`icon`) — non sérialisable à travers la frontière server/client — donc le
 * client re-résout le thème depuis le même registre statique plutôt que de
 * le recevoir en props depuis `page.tsx`.
 */
export default function ThemePageClient({ slug }: { slug: string }) {
    const theme = findKeyFigureTheme(slug);
    const { legislature } = useLegislature();

    // Défensif — `page.tsx` (server) appelle déjà `notFound()` pour un slug
    // inconnu ; ce garde-fou ne joue que si le registre changeait entre le
    // rendu serveur et l'hydratation.
    if (!theme) notFound();

    const params = { legislature: legislature?.number ?? 17 };

    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <Link href="/statistics/chiffres-cles" className="text-sm text-subtitle-accent hover:text-accent">
                    ← Retour aux chiffres clés
                </Link>
                <PageHeaderLib title={theme.title} subtitle={theme.teaser} className="mt-3 mb-0" />
            </div>

            {theme.sections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-main bg-surface-1 p-8 text-center">
                    <SpanLib className="text-subtitle-accent">
                        Ce chiffre clé n&apos;est pas encore disponible — reviens bientôt.
                    </SpanLib>
                </div>
            ) : (
                <PageContentLib>
                    {theme.sections.map((section) => (
                        <SectionBlockLoader key={section.id} section={section} params={params} onReady={() => {}} />
                    ))}
                </PageContentLib>
            )}
        </BaseLayout>
    );
}
