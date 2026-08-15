"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { ComparatorProvider, useComparator } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator-provider";
import { STATS_CATALOG } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog";
import { findStatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog.helpers";
import { StatPickerLib } from "@/app/(ui)/components/statistics/stat-picker-lib";
import { StatViewerLib } from "@/app/(ui)/components/statistics/stat-viewer-lib";

/**
 * Le hub Statistiques : StatPickerLib (explorer/sélectionner) + une grille
 * de StatViewerLib, une colonne par contexte (1 en exploration, 2 en
 * comparaison). Toute la logique vit dans ComparatorProvider — ce composant
 * ne fait que lire/écrire son état.
 */
function StatisticsHub() {
    const { state, toggleStat, enableSplit, disableSplit, setDisplayType, updateContext } = useComparator();
    const { mode, selectedStatIds, contexts, displayTypes } = state;

    const selectedDefinitions = selectedStatIds
        .map((id) => findStatDefinition(STATS_CATALOG, id))
        .filter((definition) => definition !== null);

    return (
        <main className="flex w-full flex-col gap-6">
            <div className={`grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                {contexts.map((context, contextIndex) => (
                    <StatPickerLib
                        key={contextIndex}
                        selectedStatIds={selectedStatIds}
                        onToggleStat={toggleStat}
                        context={context}
                        onContextChange={(params) => updateContext(contextIndex, params)}
                    />
                ))}
            </div>

            {selectedDefinitions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-main bg-surface-1 p-8 text-center">
                    <SpanLib className="text-subtitle-accent">
                        Sélectionne une ou plusieurs statistiques ci-dessus pour commencer.
                    </SpanLib>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between gap-3">
                        <SpanLib className="text-subtitle-accent">
                            {selectedDefinitions.length} statistique{selectedDefinitions.length > 1 ? "s" : ""} sélectionnée
                            {selectedDefinitions.length > 1 ? "s" : ""}
                        </SpanLib>
                        <ButtonLib
                            text={mode === "split" ? "Quitter la comparaison" : "Comparer"}
                            size="small"
                            variant={mode === "split" ? "secondary" : "primary"}
                            onClick={mode === "split" ? disableSplit : enableSplit}
                        />
                    </div>

                    <div className={`grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                        {contexts.map((context, contextIndex) => (
                            <div key={contextIndex} className="flex flex-col gap-4">
                                {mode === "split" && (
                                    <SpanLib className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent">
                                        {contextIndex === 0 ? "Contexte A" : "Contexte B"}
                                    </SpanLib>
                                )}

                                {selectedDefinitions.map((definition) => (
                                    <StatViewerLib
                                        key={definition.id}
                                        definition={definition}
                                        context={context}
                                        displayType={displayTypes[contextIndex]?.[definition.id] ?? null}
                                        onDisplayTypeChange={(displayType) =>
                                            setDisplayType(contextIndex, definition.id, displayType)
                                        }
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}

export default function StatisticsPageClient() {
    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Statistiques"
                    subtitle="Explore les statistiques de l'Assemblée nationale : sélectionne un ou plusieurs graphiques, change leur format d'affichage, exporte-les, et compare-les entre deux contextes (groupes, législatures, députés...)."
                />
            </div>

            <ComparatorProvider>
                <StatisticsHub />
            </ComparatorProvider>
        </BaseLayout>
    );
}
