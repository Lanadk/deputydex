"use client";

import React, { useEffect, useState } from "react";
import {EntityResolverProps} from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {useLegislaturesList} from "@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list";
import {acteursGateway} from "@/app/(ui)/gateways/acteurs/acteurs.gateway";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";
import {InputLib} from "@/app/(ui)/component-library/molecules/input/input-lib";
import {FilterGroupLib} from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";


/**
 * "Un député précis" n'a PAS de sélecteur de législature : un député reste
 * la même personne quelle que soit la législature, le nom est déjà le seul
 * filtre nécessaire pour comparer deux contextes.
 *
 * "Tous les députés" EN A besoin, contrairement à ce qu'on avait fait avant :
 * sans législature, la population est toujours "tous les députés, toutes
 * législatures confondues" des deux côtés — rien à faire varier, comparer
 * n'aurait aucun sens (cf. groupes, où "tous les groupes" se filtre déjà par
 * législature). Avec une législature choisie, comparer 16ᵉ vs 17ᵉ redevient
 * pertinent.
 */
export const ActeurEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope, otherContext }) => {
    const legislatures = useLegislaturesList();
    const [search, setSearch] = useState("");
    const [acteurs, setActeurs] = useState<ActeurDTO[]>([]);

    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    const selectedLegislature = (value.filters?.legislature as number | undefined) ?? null;

    // Valeur déjà prise par l'AUTRE colonne en comparaison — comparer une
    // législature ou un député à lui-même n'a pas de sens, ce choix est donc
    // grisé plutôt que laissé sélectionnable (voir EntityResolverProps).
    const otherLegislature = (otherContext?.filters?.legislature as number | undefined) ?? null;
    const otherEntityId = otherContext?.entityId ?? null;

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

    // Une fois un député choisi, l'input affiche son nom (au lieu de ce qui a
    // été tapé pour le trouver) et la liste se referme — retaper quelque
    // chose abandonne ce choix et relance une recherche.
    const selectedLabel = value.entityId ? ((value.filters?.entityLabel as string | undefined) ?? value.entityId) : null;

    const handleSearchChange = (v: string) => {
        setSearch(v);
        if (value.entityId) {
            onChange("entity", {});
        }
    };

    const handleSelectActeur = (acteur: ActeurDTO) => {
        onChange("entity", {
            entityId: acteur.id,
            // entityLabel voyage dans `filters` pour que le hub puisse
            // afficher un vrai libellé de contexte (voir build-context-label.ts)
            // au lieu de "Contexte A/B".
            filters: { entityLabel: `${acteur.prenom ?? ""} ${acteur.nom ?? ""}`.trim() },
        });
        setSearch("");
    };

    return (
        <div className="flex flex-col gap-3">
            <FilterGroupLib label="Portée">
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
                    onClick={() => onChange("aggregate", { filters: value.filters })}
                />
            </FilterGroupLib>

            {scope === "entity" && (
                <FilterGroupLib label="Député" className="flex-col">
                    <InputLib
                        placeholder="Rechercher un député par nom…"
                        value={selectedLabel ?? search}
                        onChange={handleSearchChange}
                    />
                    {visibleActeurs.length > 0 && (
                        <div className="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-main bg-surface-2 p-2">
                            {visibleActeurs.map((acteur) => {
                                const isTakenByOtherContext = acteur.id === otherEntityId;
                                return (
                                    <button
                                        key={acteur.id}
                                        type="button"
                                        disabled={isTakenByOtherContext}
                                        onClick={() => handleSelectActeur(acteur)}
                                        title={isTakenByOtherContext ? "Déjà choisi dans l'autre contexte" : undefined}
                                        className={`rounded px-2 py-1 text-left text-sm ${
                                            isTakenByOtherContext
                                                ? "cursor-not-allowed opacity-40"
                                                : "hover:bg-surface-3"
                                        } ${value.entityId === acteur.id ? "bg-surface-3 font-semibold" : ""}`}
                                    >
                                        {acteur.prenom} {acteur.nom}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </FilterGroupLib>
            )}

            {scope === "aggregate" && (
                <FilterGroupLib label="Législature">
                    {legislatures.map((l) => (
                        <ButtonLib
                            key={l.id}
                            text={`${l.number}ᵉ législature`}
                            size="small"
                            variant={selectedLegislature === l.number ? "primary" : "tertiary"}
                            disabled={l.number === otherLegislature}
                            onClick={() => onChange("aggregate", { filters: { ...value.filters, legislature: l.number } })}
                        />
                    ))}
                </FilterGroupLib>
            )}
        </div>
    );
};
