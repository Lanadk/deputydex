"use client";

import React from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { ComparatorProvider, useComparator } from "@/app/(ui)/providers/comparator-provider";
import { STATS_CATALOG } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog";
import { findStatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog.helpers";
import { StatPicker } from "@/app/(ui)/components/statistics/stat-picker";
import { StatViewer } from "@/app/(ui)/components/statistics/stat-viewer";
import { ENTITY_RESOLVERS } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolvers.registry";
import { buildContextLabel } from "@/app/(ui)/_shared/statistics/context/build-context-label";

/**
 * Le hub Statistiques : StatPicker (explorer/sélectionner) + une grille
 * de StatViewer, une colonne par contexte (1 en exploration, 2 en
 * comparaison). Toute la logique vit dans ComparatorProvider — ce composant
 * ne fait que lire/écrire son état.
 */
function StatisticsHub() {
    const { state, toggleStat, enableSplit, disableSplit, setDisplayType, updateContext, resetContext, clearSelection } =
        useComparator();
    const { mode, selectedStatIds, contexts, displayTypes } = state;

    const selectedDefinitions = selectedStatIds
        .map((id) => findStatDefinition(STATS_CATALOG, id))
        .filter((definition) => definition !== null);

    // Comparer n'a de sens que si le domaine sélectionné offre une vraie
    // variable à faire différer entre les deux contextes (une entité à
    // choisir, une législature...) — voir ENTITY_RESOLVERS. Sans ça, les
    // deux colonnes afficheraient strictement la même donnée non filtrée.
    const canCompare = selectedDefinitions.length > 0 && !!ENTITY_RESOLVERS[selectedDefinitions[0].domain];

    return (
        <main className="flex w-full flex-col gap-6">
            <div className={`grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                {contexts.map((context, contextIndex) => (
                    <StatPicker
                        key={contextIndex}
                        selectedStatIds={selectedStatIds}
                        onToggleStat={toggleStat}
                        context={context}
                        onContextChange={(params) => updateContext(contextIndex, params)}
                        onClearSelection={clearSelection}
                        onReset={() => resetContext(contextIndex)}
                        isComparing={mode === "split"}
                        otherContext={mode === "split" ? contexts[contextIndex === 0 ? 1 : 0] : null}
                    />
                ))}
            </div>

            {/* Décorrélé de la sélection : "Quitter la comparaison" doit rester
                accessible même si un reset vide selectedDefinitions pendant
                qu'on est en mode split (sinon plus aucun moyen de sortir). */}
            {(mode === "split" || selectedDefinitions.length > 0) && (
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <SpanLib className="text-subtitle-accent">
                            {selectedDefinitions.length} statistique{selectedDefinitions.length > 1 ? "s" : ""} sélectionnée
                            {selectedDefinitions.length > 1 ? "s" : ""}
                        </SpanLib>
                        {mode === "single" && selectedDefinitions.length > 0 && !canCompare && (
                            <SpanLib className="text-xs text-subtitle-accent">
                                Comparaison indisponible : ce domaine n&apos;a pas d&apos;entité ni de filtre à faire varier.
                            </SpanLib>
                        )}
                    </div>
                    {(mode === "split" || canCompare) && (
                        <ButtonLib
                            text={mode === "split" ? "Quitter la comparaison" : "Comparer"}
                            size="small"
                            variant={mode === "split" ? "secondary" : "primary"}
                            onClick={mode === "split" ? disableSplit : enableSplit}
                        />
                    )}
                </div>
            )}

            {selectedDefinitions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-main bg-surface-1 p-8 text-center">
                    <SpanLib className="text-subtitle-accent">
                        Sélectionne une ou plusieurs statistiques ci-dessus pour commencer.
                    </SpanLib>
                </div>
            ) : (
                <div className={`grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                    {contexts.map((context, contextIndex) => (
                        <div key={contextIndex} className="flex flex-col gap-4">
                            {mode === "split" && (
                                <SpanLib className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent">
                                    {buildContextLabel(
                                        selectedDefinitions[0]?.domain ?? null,
                                        context,
                                        contextIndex === 0 ? "Contexte A" : "Contexte B"
                                    )}
                                </SpanLib>
                            )}

                            {selectedDefinitions.map((definition) => (
                                <StatViewer
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
