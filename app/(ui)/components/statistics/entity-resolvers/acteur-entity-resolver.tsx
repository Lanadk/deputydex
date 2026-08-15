"use client";

import React, { useEffect, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import { acteursGateway } from "@/app/(ui)/gateways/acteurs/acteurs.gateway";
import { ActeurDTO } from "@/app/domains/acteurs/dto/acteur.dto";

/**
 * Pas de sélecteur de législature ici : un député reste le même quelle que
 * soit la législature, contrairement à un groupe (qui, lui, se redéfinit à
 * chaque législature). "Tous les députés" = toutes législatures confondues.
 */
export const ActeurEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope }) => {
    const [search, setSearch] = useState("");
    const [acteurs, setActeurs] = useState<ActeurDTO[]>([]);

    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    useEffect(() => {
        if (search.trim().length < 2) return;

        let cancelled = false;
        acteursGateway
            .searchDeputies(search.trim())
            .then((list) => {
                if (!cancelled) setActeurs(list);
            })
            .catch(() => {
                if (!cancelled) setActeurs([]);
            });

        return () => {
            cancelled = true;
        };
    }, [search]);

    const visibleActeurs = search.trim().length < 2 ? [] : acteurs;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                <ButtonLib
                    text="Un député précis"
                    size="small"
                    variant={scope === "entity" ? "primary" : "secondary"}
                    disabled={!canPickEntity}
                    onClick={() => onChange("entity", {})}
                />
                <ButtonLib
                    text="Tous les députés"
                    size="small"
                    variant={scope === "aggregate" ? "primary" : "secondary"}
                    disabled={!canPickAggregate}
                    onClick={() => onChange("aggregate", {})}
                />
            </div>

            {scope === "entity" && (
                <div className="flex flex-col gap-2">
                    <InputLib placeholder="Rechercher un député par nom…" value={search} onChange={setSearch} />
                    {visibleActeurs.length > 0 && (
                        <div className="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-main bg-surface-2 p-2">
                            {visibleActeurs.map((acteur) => (
                                <button
                                    key={acteur.id}
                                    type="button"
                                    onClick={() =>
                                        onChange("entity", {
                                            entityId: acteur.id,
                                            // entityLabel voyage dans `filters` pour que le hub puisse
                                            // afficher un vrai libellé de contexte (voir build-context-label.ts)
                                            // au lieu de "Contexte A/B".
                                            filters: { entityLabel: `${acteur.prenom ?? ""} ${acteur.nom ?? ""}`.trim() },
                                        })
                                    }
                                    className={`rounded px-2 py-1 text-left text-sm hover:bg-surface-3 ${
                                        value.entityId === acteur.id ? "bg-surface-3 font-semibold" : ""
                                    }`}
                                >
                                    {acteur.prenom} {acteur.nom}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
