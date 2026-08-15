"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";

// TODO: mock — à remplacer par groupesGateways.getGroupesCards(legislature) quand le backend du picker sera branché.
const MOCK_GROUPES = [
    { code: "RN", label: "Rassemblement National" },
    { code: "EPR", label: "Ensemble pour la République" },
    { code: "SOC", label: "Socialistes" },
    { code: "LFI", label: "La France insoumise" },
    { code: "DR", label: "Droite Républicaine" },
    { code: "ECOS", label: "Écologiste et Social" },
    { code: "GDR", label: "Gauche Démocrate et Républicaine" },
    { code: "HOR", label: "Horizons" },
];

export const GroupeEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope }) => {
    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                <ButtonLib
                    text="Un groupe précis"
                    size="small"
                    variant={scope === "entity" ? "primary" : "secondary"}
                    disabled={!canPickEntity}
                    onClick={() => onChange("entity", {})}
                />
                <ButtonLib
                    text="Tous les groupes"
                    size="small"
                    variant={scope === "aggregate" ? "primary" : "secondary"}
                    disabled={!canPickAggregate}
                    onClick={() => onChange("aggregate", {})}
                />
            </div>

            {scope === "entity" && (
                <div className="flex flex-wrap gap-2">
                    {MOCK_GROUPES.map((groupe) => (
                        <ButtonLib
                            key={groupe.code}
                            text={groupe.label}
                            size="small"
                            variant={value.entityId === groupe.code ? "primary" : "tertiary"}
                            onClick={() => onChange("entity", { entityId: groupe.code })}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
