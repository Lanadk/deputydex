"use client";

import React, { useEffect, useState } from "react";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {EntityResolverProps} from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import {LegislatureChoiceButtons} from "@/app/(ui)/components/statistics/entity-resolvers/legislature-choice-buttons";
import {estToutesLegislatures, PerimetreLegislature} from "@/app/_shared/statistics/perimetre-legislature";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";
import {FilterGroupLib} from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";

export const GroupeEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope, otherContext, allowAllLegislatures }) => {
    const [groupes, setGroupes] = useState<{ code: string; label: string }[]>([]);

    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    // Une législature (numéro) ou « toutes » (vue d'ensemble seulement).
    const selectedLegislature = value.filters?.legislature ?? null;
    const legislatureNumber = typeof selectedLegislature === "number" ? selectedLegislature : null;

    // Valeur déjà prise par l'AUTRE colonne en comparaison — comparer une
    // législature ou un groupe à lui-même n'a pas de sens, ce choix est donc
    // grisé plutôt que laissé sélectionnable (voir EntityResolverProps).
    const otherLegislature = otherContext?.filters?.legislature ?? null;
    const otherEntityId = otherContext?.entityId ?? null;

    // La législature elle-même n'est "prise" par l'autre contexte qu'en scope
    // aggregate (comparer "tous les groupes" de la même législature des deux
    // côtés serait comparer une population à elle-même). En scope entity,
    // deux groupes DIFFÉRENTS de la MÊME législature forment une comparaison
    // parfaitement valide — c'est le code du groupe (voir plus bas,
    // `groupe.code === otherEntityId`) qui porte alors la vraie contrainte
    // "pas le même groupe", pas la législature.
    const legislatureTaken = scope === "aggregate" ? otherLegislature : null;

    useEffect(() => {
        // Rien à faire tant qu'aucune législature n'est choisie — le bloc
        // liste est de toute façon masqué dans ce cas (voir le rendu
        // conditionnel plus bas), inutile de vider `groupes` ici.
        if (legislatureNumber == null) return;

        let cancelled = false;

        groupesGateways
            .getGroupesCards(legislatureNumber)
            .then((cards) => {
                if (!cancelled) setGroupes(cards.map((c) => ({ code: c.groupeCode, label: c.groupeLabel })));
            })
            .catch(() => {
                if (!cancelled) setGroupes([]);
            });

        return () => {
            cancelled = true;
        };
    }, [legislatureNumber]);

    // Pas de bouton « sans filtre » ici : `legislature` n'est jamais undefined.
    const setLegislature = (legislature: PerimetreLegislature | undefined) => {
        onChange(scope, { entityId: value.entityId, filters: { ...value.filters, legislature } });
    };

    // « Toutes » n'existe pas pour un groupe précis : il est retiré en passant en scope entity.
    const filtresPourEntite = () => {
        if (!estToutesLegislatures(value.filters?.legislature)) return value.filters;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { legislature, ...reste } = value.filters ?? {};
        return reste;
    };

    return (
        <div className="flex flex-col gap-3">
            <FilterGroupLib label="Portée">
                <ButtonLib
                    text="Un groupe précis"
                    size="small"
                    variant={scope === "entity" ? "primary" : "secondary"}
                    disabled={!canPickEntity}
                    onClick={() => onChange("entity", { filters: filtresPourEntite() })}
                />
                <ButtonLib
                    text="Tous les groupes"
                    size="small"
                    variant={scope === "aggregate" ? "primary" : "secondary"}
                    disabled={!canPickAggregate}
                    onClick={() => onChange("aggregate", { filters: value.filters })}
                />
            </FilterGroupLib>

            <LegislatureChoiceButtons
                value={selectedLegislature}
                otherValue={legislatureTaken}
                // « Toutes » (vue d'ensemble seulement) : chaque groupe de chaque législature à part.
                allowAll={allowAllLegislatures && scope === "aggregate"}
                onSelect={setLegislature}
            />

            {scope === "entity" && legislatureNumber != null && (
                <FilterGroupLib label="Groupe">
                    {groupes.length === 0 && (
                        <span className="text-sm text-subtitle-accent">Aucun groupe trouvé pour cette législature.</span>
                    )}
                    {groupes.map((groupe) => (
                        <ButtonLib
                            key={groupe.code}
                            text={groupe.label}
                            size="small"
                            variant={value.entityId === groupe.code ? "primary" : "tertiary"}
                            // Un même code de groupe peut être réutilisé d'une législature à
                            // l'autre (ex: "HOR" en 16ᵉ et en 17ᵉ) — le code seul ne suffit
                            // donc pas à identifier "le même groupe qu'en face" : il faut AUSSI
                            // que la législature choisie soit la même, sinon on bloquerait à
                            // tort une comparaison temporelle légitime (HOR16 vs HOR17).
                            disabled={groupe.code === otherEntityId && legislatureNumber === otherLegislature}
                            onClick={() =>
                                onChange("entity", {
                                    entityId: groupe.code,
                                    // entityLabel voyage dans `filters` pour que le hub puisse
                                    // afficher un vrai libellé de contexte (voir build-context-label.ts)
                                    // au lieu de "Contexte A/B".
                                    filters: { ...value.filters, entityLabel: groupe.code },
                                })
                            }
                        />
                    ))}
                </FilterGroupLib>
            )}
        </div>
    );
};
