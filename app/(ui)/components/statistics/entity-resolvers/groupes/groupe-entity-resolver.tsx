"use client";

import React, { useEffect, useState } from "react";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {EntityResolverProps} from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import {useLegislaturesList} from "@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";
import {FilterGroupLib} from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";

export const GroupeEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope, otherContext }) => {
    const legislatures = useLegislaturesList();
    const [groupes, setGroupes] = useState<{ code: string; label: string }[]>([]);

    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    const selectedLegislature = (value.filters?.legislature as number | undefined) ?? null;

    // Valeur déjà prise par l'AUTRE colonne en comparaison — comparer une
    // législature ou un groupe à lui-même n'a pas de sens, ce choix est donc
    // grisé plutôt que laissé sélectionnable (voir EntityResolverProps).
    const otherLegislature = (otherContext?.filters?.legislature as number | undefined) ?? null;
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
        if (selectedLegislature == null) return;

        let cancelled = false;

        groupesGateways
            .getGroupesCards(selectedLegislature)
            .then((cards) => {
                if (!cancelled) setGroupes(cards.map((c) => ({ code: c.groupeCode, label: c.groupeLabel })));
            })
            .catch(() => {
                if (!cancelled) setGroupes([]);
            });

        return () => {
            cancelled = true;
        };
    }, [selectedLegislature]);

    const setLegislatureNumber = (n: number) => {
        onChange(scope, { entityId: value.entityId, filters: { ...value.filters, legislature: n } });
    };

    return (
        <div className="flex flex-col gap-3">
            <FilterGroupLib label="Portée">
                <ButtonLib
                    text="Un groupe précis"
                    size="small"
                    variant={scope === "entity" ? "primary" : "secondary"}
                    disabled={!canPickEntity}
                    onClick={() => onChange("entity", { filters: value.filters })}
                />
                <ButtonLib
                    text="Tous les groupes"
                    size="small"
                    variant={scope === "aggregate" ? "primary" : "secondary"}
                    disabled={!canPickAggregate}
                    onClick={() => onChange("aggregate", { filters: value.filters })}
                />
            </FilterGroupLib>

            <FilterGroupLib label="Législature">
                {legislatures.map((l) => (
                    <ButtonLib
                        key={l.id}
                        text={`${l.number}ᵉ législature`}
                        size="small"
                        variant={selectedLegislature === l.number ? "primary" : "tertiary"}
                        disabled={l.number === legislatureTaken}
                        onClick={() => setLegislatureNumber(l.number)}
                    />
                ))}
            </FilterGroupLib>

            {scope === "entity" && selectedLegislature != null && (
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
                            disabled={groupe.code === otherEntityId && selectedLegislature === otherLegislature}
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
