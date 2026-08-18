"use client";

import React from "react";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { useLegislaturesList } from "@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { FilterGroupLib } from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";

/**
 * Le domaine "votes" n'a pas de notion d'entité précise (pas de "vote
 * individuel" à choisir, contrairement à un groupe ou un député) — toutes
 * ses stats sont `scope: "aggregate"`, donc pas de bloc "Portée" comme
 * GroupeEntityResolver/ActeurEntityResolver, juste le filtre législature.
 * Sans lui, `isContextReady` considérait ce domaine "toujours prêt" (aucun
 * resolver = rien à attendre) et les stats par-législature (positions,
 * total) fetchaient sans filtre — voir ENTITY_RESOLVERS.
 */
export const VotesEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, otherContext }) => {
    const legislatures = useLegislaturesList();

    const selectedLegislature = (value.filters?.legislature as number | undefined) ?? null;

    // Comparer "tous les votes" de la même législature des deux côtés
    // reviendrait à comparer une population à elle-même — même règle que
    // GroupeEntityResolver/ActeurEntityResolver en scope aggregate.
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
