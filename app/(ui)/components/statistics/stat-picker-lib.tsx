"use client";

import React, { useState } from "react";
import { CheckboxLib } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib";
import { STATS_CATALOG } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog";
import {
    findStatDefinition,
    getComparableStats,
    groupStatsByCategory,
} from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog.helpers";
import { StatDomain, StatFetchParams, StatScope } from "@/app/_shared/statistics/stat-scope.types";
import { ENTITY_RESOLVERS } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolvers.registry";

interface StatPickerLibProps {
    /** ids déjà sélectionnés (ComparatorState.selectedStatIds) — pilote la contrainte domaine/scope */
    selectedStatIds: string[];
    onToggleStat: (definitionId: string) => void;
    /** contexte du contexte de comparaison que CE picker édite (contexts[contextIndex]) */
    context: StatFetchParams;
    onContextChange: (params: StatFetchParams) => void;
}

/**
 * Menu domaines (tuiles) → résolution entité précise vs population
 * (EntityResolver du domaine, s'il existe) → dropdown par catégorie (cases
 * à cocher). Dès qu'une stat est sélectionnée, les domaines/scopes
 * incompatibles se désactivent — impossible d'aboutir à une sélection
 * invalide, cohérent avec le garde-fou de comparator.reducer.ts.
 *
 * Composant propre à la feature Statistics (types StatDefinition non
 * génériques) — volontairement hors component-library, voir
 * app/(ui)/components/groups/group-filters.tsx pour le même principe.
 */
export const StatPickerLib: React.FC<StatPickerLibProps> = ({
                                                                  selectedStatIds,
                                                                  onToggleStat,
                                                                  context,
                                                                  onContextChange,
                                                              }) => {
    const [openDomain, setOpenDomain] = useState<StatDomain | null>(null);
    const [localScope, setLocalScope] = useState<StatScope>("aggregate");

    const referenceId = selectedStatIds[0];
    const reference = referenceId ? findStatDefinition(STATS_CATALOG, referenceId) : null;
    const selectionConstraint = reference ? { domain: reference.domain, scope: reference.scope } : null;
    const lockedScope = reference?.scope ?? null;

    const activeDomain = selectionConstraint?.domain ?? openDomain;
    const effectiveScope: StatScope = lockedScope ?? localScope;

    const comparableForSelection = getComparableStats(STATS_CATALOG, selectionConstraint);
    const comparableInScope = activeDomain
        ? getComparableStats(STATS_CATALOG, { domain: activeDomain, scope: effectiveScope })
        : [];

    const EntityResolverComponent = activeDomain ? ENTITY_RESOLVERS[activeDomain] : undefined;

    const handleOpenDomain = (domain: StatDomain) => {
        setOpenDomain(domain);
        setLocalScope("aggregate");
    };

    return (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-main bg-surface-1 p-4">
            <div className="flex flex-wrap gap-3">
                {STATS_CATALOG.map((module) => {
                    const availableInDomain = comparableForSelection.filter((stat) => stat.domain === module.id);
                    const isDisabled = availableInDomain.length === 0;
                    const isActive = activeDomain === module.id;

                    return (
                        <button
                            key={module.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleOpenDomain(module.id)}
                            className={`flex flex-1 min-w-[140px] flex-col items-center gap-2 rounded-xl border p-5 text-center transition-colors ${
                                isActive ? "border-accent bg-surface-2" : "border-main bg-surface-1"
                            } ${isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-2"}`}
                        >
                            <module.icon className="h-6 w-6" style={{ color: isActive ? "var(--accent)" : "var(--subtitle-accent)" }} />
                            <span className="text-sm font-semibold">{module.label}</span>
                        </button>
                    );
                })}
            </div>

            {activeDomain && (
                <div className="flex flex-col gap-4 border-t border-main pt-4">
                    {EntityResolverComponent && (
                        <EntityResolverComponent
                            value={context}
                            scope={effectiveScope}
                            lockedScope={lockedScope}
                            onChange={(scope, params) => {
                                setLocalScope(scope);
                                onContextChange(params);
                            }}
                        />
                    )}

                    <div className="flex flex-col gap-2">
                        {groupStatsByCategory(comparableInScope).map((group) => (
                            <details key={group.category} className="rounded-lg border border-main bg-surface-2 px-3 py-2">
                                <summary className="cursor-pointer text-sm font-semibold text-subtitle-accent">
                                    {group.category}
                                </summary>
                                <div className="mt-2 flex flex-col gap-1.5 pl-1">
                                    {group.stats.map((stat) => (
                                        <CheckboxLib
                                            key={stat.id}
                                            isChecked={selectedStatIds.includes(stat.id)}
                                            onToggle={() => onToggleStat(stat.id)}
                                            label={stat.title}
                                        />
                                    ))}
                                </div>
                            </details>
                        ))}
                        {comparableInScope.length === 0 && (
                            <p className="text-sm text-subtitle-accent">Aucune statistique disponible pour ce choix.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
