"use client";

import React from "react";
import Link from "next/link";
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
 * Le hub "Mode avancé" : StatPicker (explorer/sélectionner) + une grille
 * de StatViewer, une colonne par contexte (1 en exploration, 2 en
 * comparaison). Toute la logique vit dans ComparatorProvider — ce composant
 * ne fait que lire/écrire son état.
 *
 * Anciennement `/statistics` lui-même — déplacé sous `/statistics/avance`
 * quand `/statistics` est devenu un hub de choix entre ce mode et
 * "Chiffres clés" (pages éditoriales, voir `chiffres-cles/`). Le contenu de
 * ce composant n'a pas changé, seule sa route a bougé.
 */
function StatisticsAdvancedHub() {
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
                <div className="flex flex-col gap-4">
                    {mode === "split" && (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {contexts.map((context, contextIndex) => (
                                <SpanLib
                                    key={contextIndex}
                                    className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent"
                                >
                                    {buildContextLabel(
                                        selectedDefinitions[0]?.domain ?? null,
                                        context,
                                        contextIndex === 0 ? "Contexte A" : "Contexte B"
                                    )}
                                </SpanLib>
                            ))}
                        </div>
                    )}

                    {/*
                        Une grid PAR statistique (definition en boucle externe, context en
                        interne) plutôt qu'une seule grid globale avec une colonne par
                        contexte : sinon les deux colonnes ne sont que deux piles
                        indépendantes de cartes empilées côte à côte — dès qu'une carte est
                        plus haute que sa vis-à-vis (texte plus long, chart avec plus de
                        catégories...), tout ce qui suit dans l'autre colonne se décale et
                        les paires à comparer ne sont plus alignées. Une grid par stat
                        confine l'écart de hauteur à SA propre paire : les deux cartes
                        démarrent alignées en haut, mais `items-start` (au lieu du
                        `stretch` par défaut de CSS Grid) laisse chacune sa propre hauteur
                        — ouvrir "Comment c'est calculé ?" ou un insight plus long d'un
                        côté n'étire jamais la carte d'en face.
                    */}
                    {selectedDefinitions.map((definition) => (
                        <div
                            key={definition.id}
                            className={`grid items-start gap-4 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}
                        >
                            {contexts.map((context, contextIndex) => (
                                <StatViewer
                                    key={contextIndex}
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

export default function AvancePageClient() {
    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <Link href="/statistics" className="text-sm text-subtitle-accent hover:text-accent">
                    ← Retour au hub Statistiques
                </Link>
                <PageHeaderLib
                    title="Mode avancé"
                    subtitle="Explore les statistiques de l'Assemblée nationale : sélectionne un ou plusieurs graphiques, change leur format d'affichage, exporte-les, et compare-les entre deux contextes (groupes, législatures, députés...)."
                    className="mt-3 mb-0"
                />
            </div>

            <ComparatorProvider>
                <StatisticsAdvancedHub />
            </ComparatorProvider>
        </BaseLayout>
    );
}
