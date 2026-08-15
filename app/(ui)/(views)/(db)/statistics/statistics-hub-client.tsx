"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

/**
 * `/statistics` — plus l'explorateur lui-même (déplacé sous `/statistics/avance`,
 * voir `avance/avance-page-client.tsx`), mais un hub à deux entrées :
 *
 * - "Chiffres clés" (`chiffres-cles/`) : pages éditoriales, un grand chiffre
 *   par thème, textes d'explication, pensées pour le grand public.
 * - "Mode avancé" (`avance/`) : le catalogue Statistiques existant —
 *   recherche/sélection/comparaison/export, pensé pour qui veut creuser.
 *
 * Voir `5.STATS-CATALOG_client_side.md` pour l'architecture des deux.
 */
export default function StatisticsHubClient() {
    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Statistiques"
                    subtitle="Découvre les grands chiffres de l'Assemblée nationale, ou explore la base de données dans le détail."
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Link href="/statistics/chiffres-cles">
                    <div className="flex h-full flex-col gap-4 rounded-xl border border-main bg-surface-1 p-6 transition-colors hover:bg-surface-2">
                        <Sparkles className="h-8 w-8" style={{ color: "var(--accent)" }} />
                        <div>
                            <h3 className="text-lg font-semibold">Chiffres clés</h3>
                            <SpanLib className="mt-2 block text-sm leading-relaxed text-subtitle-accent">
                                Les grands chiffres de l&apos;Assemblée nationale expliqués simplement : qui sont
                                les député·es, comment votent-ils, comment ça évolue. Un thème à la fois, avec du
                                contexte.
                            </SpanLib>
                        </div>
                    </div>
                </Link>

                <Link href="/statistics/avance">
                    <div className="flex h-full flex-col gap-4 rounded-xl border border-main bg-surface-1 p-6 transition-colors hover:bg-surface-2">
                        <BarChart3 className="h-8 w-8" style={{ color: "var(--accent)" }} />
                        <div>
                            <h3 className="text-lg font-semibold">Mode avancé</h3>
                            <SpanLib className="mt-2 block text-sm leading-relaxed text-subtitle-accent">
                                Le catalogue complet : cherche une statistique précise, change son format
                                d&apos;affichage, compare-la entre deux groupes, deux législatures ou deux
                                député·es, exporte-la.
                            </SpanLib>
                        </div>
                    </div>
                </Link>
            </div>
        </BaseLayout>
    );
}
