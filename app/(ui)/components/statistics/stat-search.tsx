"use client";

import React, { useMemo, useState } from "react";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { StatDomainModule } from "@/app/(ui)/_shared/statistics/catalog/stats-domain.types";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { searchStats } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog.helpers";

interface StatSearchProps {
    catalog: StatDomainModule[];
    /** Restreint les résultats à cet ensemble d'ids (ex: stats comparables en mode split) — absent = tout le catalogue. */
    restrictToIds?: Set<string>;
    selectedStatIds: string[];
    onSelect: (stat: StatDefinition) => void;
    placeholder?: string;
}

const SCOPE_LABEL: Record<StatDefinition["scope"], string> = {
    aggregate: "Population",
    entity: "Élément précis",
};

/**
 * Recherche plein-texte sur TOUT le catalogue (`searchStats`), tous domaines
 * confondus — chaque résultat affiche son domaine, sa catégorie et son scope
 * pour qu'on n'ait pas à deviner où une stat "vit" avant de la sélectionner.
 * Complète `StatPicker` (domaine → scope → catégorie) plutôt que le
 * remplacer : sélectionner un résultat ici pré-positionne le picker sur le
 * bon domaine/scope (voir `handleSearchSelect` dans stat-picker.tsx), qui
 * reste la seule source de vérité pour la sélection effective.
 *
 * Composant propre à la feature Statistics (types StatDefinition non
 * génériques) — volontairement hors component-library, même principe que
 * `StatPicker`.
 */
export const StatSearch: React.FC<StatSearchProps> = ({ catalog, restrictToIds, selectedStatIds, onSelect, placeholder }) => {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        const matches = searchStats(catalog, query);
        return restrictToIds ? matches.filter((stat) => restrictToIds.has(stat.id)) : matches;
    }, [catalog, query, restrictToIds]);

    const handleSelect = (stat: StatDefinition) => {
        // Champ vidé après sélection — prêt à chercher la statistique
        // suivante (on peut en cocher plusieurs) ; vide = plus de résultats
        // affichés, donc ferme le menu du même coup.
        setQuery("");
        onSelect(stat);
    };

    const showResults = query.trim().length > 0;

    return (
        <div className="flex flex-col gap-2">
            <InputLib
                value={query}
                onChange={setQuery}
                placeholder={placeholder ?? "Rechercher une ou plusieurs statistiques — nom, thème, mot-clé..."}
            />

            {showResults && (
                <div className="flex max-h-80 flex-col overflow-y-auto rounded-lg border border-main bg-surface-1">
                    {results.length === 0 ? (
                        <p className="p-3 text-sm text-subtitle-accent">
                            Aucune statistique ne correspond à &quot;{query}&quot;.
                        </p>
                    ) : (
                        results.map((stat, index) => {
                            const statModule = catalog.find((m) => m.id === stat.domain);
                            const isSelected = selectedStatIds.includes(stat.id);

                            return (
                                <button
                                    key={stat.id}
                                    type="button"
                                    onClick={() => handleSelect(stat)}
                                    className={`flex flex-col items-start gap-1 px-3 py-2.5 text-left transition-all duration-100 active:scale-[0.98] ${
                                        index > 0 ? "border-t border-main" : ""
                                    } ${isSelected ? "bg-surface-2" : "hover:bg-surface-2"}`}
                                >
                                    {/* Un seul badge (le domaine, l'info qu'on ne devine pas) — le
                                        reste en texte simple séparé par "·", pour ne pas empiler
                                        3-4 pastilles bordées par résultat. */}
                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-subtitle-accent">
                                        {statModule && (
                                            <span className="inline-flex items-center gap-1 font-medium text-accent">
                                                <statModule.icon className="h-3 w-3" />
                                                {statModule.label}
                                            </span>
                                        )}
                                        <span>·</span>
                                        <span>{stat.category}</span>
                                        <span>·</span>
                                        <span>{SCOPE_LABEL[stat.scope]}</span>
                                        {stat.unit && (
                                            <>
                                                <span>·</span>
                                                <span>{stat.unit}</span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold">{stat.title}</span>
                                    {stat.description && (
                                        <span className="text-xs text-subtitle-accent">{stat.description}</span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
