"use client";

import React from "react";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { LegislatureChoiceButtons } from "@/app/(ui)/components/statistics/entity-resolvers/legislature-choice-buttons";

/**
 * Le domaine "votes" n'a pas de notion d'entité précise (pas de "vote
 * individuel" à choisir, contrairement à un groupe ou un député) — toutes
 * ses stats sont `scope: "aggregate"`, donc pas de bloc "Portée" comme
 * GroupeEntityResolver/ActeurEntityResolver, juste le filtre législature.
 * Sans lui, `isContextReady` considérait ce domaine "toujours prêt" (aucun
 * resolver = rien à attendre) et les stats par-législature (positions,
 * total) fetchaient sans filtre — voir ENTITY_RESOLVERS.
 *
 * Réutilisé tel quel par LegislaturesEntityResolver ; « Toutes » n'y apparaît
 * que si le domaine a des stats qui l'acceptent (`allowAllLegislatures`).
 */
export const VotesEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, otherContext, allowAllLegislatures }) => (
    <div className="flex flex-col gap-3">
        {/* Comparer la même législature des deux côtés reviendrait à comparer
            une population à elle-même — même règle que GroupeEntityResolver /
            ActeurEntityResolver en scope aggregate. */}
        <LegislatureChoiceButtons
            value={value.filters?.legislature}
            otherValue={otherContext?.filters?.legislature}
            allowAll={allowAllLegislatures}
            onSelect={(legislature) => onChange(scope, { filters: { ...value.filters, legislature } })}
        />
    </div>
);
