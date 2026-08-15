"use client";

import React from "react";
import Link from "next/link";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import { KEY_FIGURE_THEMES } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes.registry";

export default function ChiffresClesPageClient() {
    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <Link href="/statistics" className="text-sm text-subtitle-accent hover:text-accent">
                    ← Retour au hub Statistiques
                </Link>
                <PageHeaderLib
                    title="Chiffres clés"
                    subtitle="Les grands chiffres de l'Assemblée nationale, expliqués : qui sont les député·es, comment votent-ils, comment ça évolue."
                    className="mt-3 mb-0"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {KEY_FIGURE_THEMES.map((theme) => {
                    const available = theme.sections.length > 0;
                    return (
                        <Link key={theme.slug} href={`/statistics/chiffres-cles/${theme.slug}`}>
                            <div className="flex h-full flex-col gap-3 rounded-xl border border-main bg-surface-1 p-5 transition-colors hover:bg-surface-2">
                                <div className="flex items-start justify-between gap-3">
                                    <theme.icon className="h-6 w-6" style={{ color: "var(--accent)" }} />
                                    {!available && <BadgeLib text="Bientôt disponible" variant="tertiary" />}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold">{theme.title}</h3>
                                    <SpanLib className="mt-1 block text-sm leading-relaxed text-subtitle-accent">
                                        {theme.teaser}
                                    </SpanLib>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </BaseLayout>
    );
}
