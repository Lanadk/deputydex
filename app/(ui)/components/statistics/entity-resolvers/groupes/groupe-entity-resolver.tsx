"use client";

import React, { useEffect, useState } from "react";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {EntityResolverProps} from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";
import {useLegislaturesList} from "@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";

export const GroupeEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope }) => {
    const legislatures = useLegislaturesList();
    const [groupes, setGroupes] = useState<{ code: string; label: string }[]>([]);

    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    const selectedLegislature = (value.filters?.legislature as number | undefined) ?? null;

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
            <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="flex flex-wrap gap-2">
                {legislatures.map((l) => (
                    <ButtonLib
                        key={l.id}
                        text={`${l.number}ᵉ législature`}
                        size="small"
                        variant={selectedLegislature === l.number ? "primary" : "tertiary"}
                        onClick={() => setLegislatureNumber(l.number)}
                    />
                ))}
            </div>

            {scope === "entity" && selectedLegislature != null && (
                <div className="flex flex-wrap gap-2">
                    {groupes.length === 0 && (
                        <span className="text-sm text-subtitle-accent">Aucun groupe trouvé pour cette législature.</span>
                    )}
                    {groupes.map((groupe) => (
                        <ButtonLib
                            key={groupe.code}
                            text={groupe.label}
                            size="small"
                            variant={value.entityId === groupe.code ? "primary" : "tertiary"}
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
                </div>
            )}
        </div>
    );
};
