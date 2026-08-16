"use client";

import React from "react";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { useLegislaturesList } from "@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { FilterGroupLib } from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";

/**
 * Même principe que VotesEntityResolver : "scrutins" n'a pas de notion
 * d'entité précise (toutes ses stats sont `scope: "aggregate"`), juste le
 * filtre législature, imposé avant d'afficher les stats disponibles.
 *
 * Effet de bord assumé : ça impose AUSSI ce choix pour
 * `scrutins.participation`, qui l'ignore complètement (évolution
 * volontairement toutes législatures confondues) — un clic de plus sans
 * rapport avec ce que le graphe affiche ensuite, mais nécessaire pour que
 * `scrutins.total` (qui, lui, en a réellement besoin) cesse de fetcher sans
 * filtre — voir ENTITY_RESOLVERS.
 */
export const ScrutinsEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, otherContext }) => {
    const legislatures = useLegislaturesList();

    const selectedLegislature = (value.filters?.legislature as number | undefined) ?? null;

    // Comparer "tous les scrutins" de la même législature des deux côtés
    // reviendrait à comparer une population à elle-même — même règle que
    // GroupeEntityResolver/ActeurEntityResolver/VotesEntityResolver en scope
    // aggregate.
    const otherLegislature = (otherContext?.filters?.legislature as number | undefined) ?? null;

    return (
        <div className="flex flex-col gap-3">
            <FilterGroupLib label="Législature">
                {legislatures.map((l) => (
                    <ButtonLib
                        key={l.id}
                        text={`${l.number}ᵉ législature`}
                        size="small"
                        variant={selectedLegislature === l.number ? "primary" : "tertiary"}
                        disabled={l.number === otherLegislature}
                        onClick={() => onChange(scope, { filters: { ...value.filters, legislature: l.number } })}
                    />
                ))}
            </FilterGroupLib>
        </div>
    );
};
