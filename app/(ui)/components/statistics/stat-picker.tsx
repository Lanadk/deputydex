"use client";

import React, { useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { CheckboxLib } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib";
import { STATS_CATALOG } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog";
import {
    findStatDefinition,
    getComparableStats,
    groupStatsByCategory,
} from "@/app/(ui)/_shared/statistics/catalog/stats-catalog.helpers";
import { StatDomain, StatFetchParams, StatScope } from "@/app/_shared/statistics/stat-scope.types";
import { ENTITY_RESOLVERS } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolvers.registry";
import { isContextReady } from "@/app/(ui)/_shared/statistics/context/is-context-ready";

interface StatPickerProps {
    /** ids déjà sélectionnés (ComparatorState.selectedStatIds) — pilote la contrainte domaine/scope */
    selectedStatIds: string[];
    onToggleStat: (definitionId: string) => void;
    /** contexte du contexte de comparaison que CE picker édite (contexts[contextIndex]) */
    context: StatFetchParams;
    onContextChange: (params: StatFetchParams) => void;
    /** vide selectedStatIds — utilisé par "Réinitialiser" et par le changement de domaine/scope hors comparaison */
    onClearSelection: () => void;
    /** true seulement en mode split — la contrainte domaine/scope ne se justifie qu'en comparaison réelle */
    isComparing: boolean;
}

/**
 * Menu domaines (tuiles) → résolution entité précise vs population
 * (EntityResolver du domaine, s'il existe) → dropdown par catégorie (cases
 * à cocher). Deux garde-fous :
 *
 * 1. Domaine/scope incompatibles désactivés — mais SEULEMENT en comparaison
 *    (`isComparing`) : hors comparaison, rien n'empêche de changer de
 *    domaine/scope librement, ça vide juste la sélection en cours (elle
 *    n'aurait plus de sens dans le nouveau contexte).
 * 2. Les catégories ne s'affichent qu'une fois le contexte "prêt" (entité
 *    choisie en scope entity, législature choisie en scope aggregate dès
 *    qu'un EntityResolver existe pour le domaine) — cocher une stat avant ça
 *    déclencherait un fetch avec des paramètres incomplets côté serveur.
 *
 * Composant propre à la feature Statistics (types StatDefinition non
 * génériques) — volontairement hors component-library, voir
 * app/(ui)/components/groups/group-filters.tsx pour le même principe.
 */
export const StatPicker: React.FC<StatPickerProps> = ({
                                                            selectedStatIds,
                                                            onToggleStat,
                                                            context,
                                                            onContextChange,
                                                            onClearSelection,
                                                            isComparing,
                                                        }) => {
    const [openDomain, setOpenDomain] = useState<StatDomain | null>(null);
    const [localScope, setLocalScope] = useState<StatScope>("aggregate");

    const referenceId = selectedStatIds[0];
    const reference = referenceId ? findStatDefinition(STATS_CATALOG, referenceId) : null;
    const rawConstraint = reference ? { domain: reference.domain, scope: reference.scope } : null;

    // La contrainte de compatibilité ne s'applique qu'en comparaison
    const selectionConstraint = isComparing ? rawConstraint : null;
    const lockedScope = isComparing ? (reference?.scope ?? null) : null;

    const activeDomain = openDomain ?? rawConstraint?.domain ?? null;
    const effectiveScope: StatScope = lockedScope ?? localScope;

    const comparableForSelection = getComparableStats(STATS_CATALOG, selectionConstraint);
    const comparableInScope = activeDomain
        ? getComparableStats(STATS_CATALOG, { domain: activeDomain, scope: effectiveScope })
        : [];

    const EntityResolverComponent = activeDomain ? ENTITY_RESOLVERS[activeDomain] : undefined;

    // Même règle que useStatData (voir is-context-ready.ts) : une entité
    // choisie (scope entity) ou une législature choisie (scope aggregate)
    // avant de proposer quoi que ce soit à cocher — sinon un fetch avec des
    // paramètres incomplets ferait échouer la requête serveur.
    const isReady = activeDomain ? isContextReady(activeDomain, effectiveScope, context) : false;

    const handleOpenDomain = (domain: StatDomain) => {
        if (!isComparing && rawConstraint && rawConstraint.domain !== domain) {
            onClearSelection();
        }
        setOpenDomain(domain);
        setLocalScope("aggregate");
    };

    const handleReset = () => {
        // selectedStatIds est PARTAGÉ entre les deux contextes en comparaison
        // (mêmes stats, contextes différents — c'est le principe même du
        // comparateur). En comparaison, réinitialiser ce picker ne doit donc
        // toucher QUE son propre contexte (filtres/entité) : le vider
        // globalement viderait aussi le graphe affiché de l'autre côté.
        if (isComparing) {
            onContextChange({});
            return;
        }

        setOpenDomain(null);
        setLocalScope("aggregate");
        onClearSelection();
        onContextChange({});
    };

    return (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-main bg-surface-1 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 flex-wrap gap-3">
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

                {(activeDomain || selectedStatIds.length > 0) && (
                    <ButtonLib
                        text={isComparing ? "Réinitialiser ce contexte" : "Réinitialiser"}
                        size="small"
                        variant="tertiary"
                        onClick={handleReset}
                    />
                )}
            </div>

            {activeDomain && (
                <div className="flex flex-col gap-4 border-t border-main pt-4">
                    {EntityResolverComponent && (
                        <EntityResolverComponent
                            value={context}
                            scope={effectiveScope}
                            lockedScope={lockedScope}
                            onChange={(newScope, params) => {
                                if (!isComparing && rawConstraint && rawConstraint.scope !== newScope) {
                                    onClearSelection();
                                }
                                setLocalScope(newScope);
                                onContextChange(params);
                            }}
                        />
                    )}

                    {isReady ? (
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
                    ) : (
                        <p className="text-sm text-subtitle-accent">
                            {effectiveScope === "entity"
                                ? "Choisis d'abord un élément précis pour voir les statistiques disponibles."
                                : "Choisis d'abord une législature pour voir les statistiques disponibles."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
