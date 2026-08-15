"use client";

import React, { useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { CheckboxLib } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib";
import { STATS_CATALOG } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog";
import {
    findStatDefinition,
    getComparableStats,
    groupStatsByCategory,
} from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog.helpers";
import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";

interface StatPickerLibProps {
    /** ids déjà sélectionnés (ComparatorState.selectedStatIds) — pilote aussi la contrainte domaine/scope */
    selectedStatIds: string[];
    onToggleStat: (definitionId: string) => void;
}

/**
 * Menu domaines (boutons) + dropdown par catégorie (cases à cocher) pour
 * explorer STATS_CATALOG et construire `selectedStatIds`. Dès qu'une stat
 * est sélectionnée, les domaines/catégories incompatibles (autre domain ou
 * scope) se désactivent — impossible d'aboutir à une sélection invalide,
 * cohérent avec le garde-fou de comparator.reducer.ts.
 *
 * Composant propre à la feature Statistics (types StatDefinition non
 * génériques) — volontairement hors component-library, voir
 * app/(ui)/components/groups/group-filters.tsx pour le même principe.
 */
export const StatPickerLib: React.FC<StatPickerLibProps> = ({ selectedStatIds, onToggleStat }) => {
    const [openDomain, setOpenDomain] = useState<StatDomain | null>(null);

    const referenceId = selectedStatIds[0];
    const reference = referenceId ? findStatDefinition(STATS_CATALOG, referenceId) : null;
    const constraint = reference ? { domain: reference.domain, scope: reference.scope } : null;

    const comparable = getComparableStats(STATS_CATALOG, constraint);
    const activeDomain = constraint?.domain ?? openDomain;

    return (
        <div className="flex w-full flex-col gap-3 rounded-xl border border-main bg-surface-1 p-4">
            <div className="flex flex-wrap gap-2">
                {STATS_CATALOG.map((module) => {
                    const availableInDomain = comparable.filter((stat) => stat.domain === module.id);
                    const isDisabled = availableInDomain.length === 0;
                    const isActive = activeDomain === module.id;

                    return (
                        <ButtonLib
                            key={module.id}
                            text={module.label}
                            icon={module.icon}
                            size="small"
                            variant={isActive ? "primary" : "secondary"}
                            disabled={isDisabled}
                            onClick={() => setOpenDomain(module.id)}
                        />
                    );
                })}
            </div>

            {activeDomain && (
                <div className="flex flex-col gap-2">
                    {groupStatsByCategory(comparable.filter((stat) => stat.domain === activeDomain)).map((group) => (
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
                </div>
            )}
        </div>
    );
};
