"use client";

import React, { useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { EntityResolverProps } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolver.types";

// TODO: mock — à remplacer par acteursGateway.search(...) et legislaturesGateway.getAllLegislatures() quand le backend du picker sera branché.
const MOCK_ACTEURS = [
    { id: "PA001", label: "Amélie Durand" },
    { id: "PA002", label: "Karim Benali" },
    { id: "PA003", label: "Chloé Martin" },
    { id: "PA004", label: "Julien Petit" },
    { id: "PA005", label: "Fatima Zahra" },
    { id: "PA006", label: "Nicolas Faure" },
    { id: "PA007", label: "Léa Rousseau" },
    { id: "PA008", label: "Mehdi Charpentier" },
];

const MOCK_LEGISLATURES = [17, 16, 15];

export const ActeurEntityResolver: React.FC<EntityResolverProps> = ({ value, scope, onChange, lockedScope }) => {
    const [search, setSearch] = useState("");

    const canPickEntity = lockedScope !== "aggregate";
    const canPickAggregate = lockedScope !== "entity";

    const selectedActeur = MOCK_ACTEURS.find((a) => a.id === value.entityId);
    const results =
        search.trim().length > 0
            ? MOCK_ACTEURS.filter((a) => a.label.toLowerCase().includes(search.trim().toLowerCase()))
            : [];

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
                    <InputLib
                        placeholder="Rechercher un député…"
                        value={selectedActeur ? selectedActeur.label : search}
                        onChange={setSearch}
                    />
                    {results.length > 0 && (
                        <div className="flex flex-col gap-1 rounded-lg border border-main bg-surface-2 p-2">
                            {results.map((acteur) => (
                                <button
                                    key={acteur.id}
                                    type="button"
                                    onClick={() => {
                                        onChange("entity", { entityId: acteur.id });
                                        setSearch("");
                                    }}
                                    className="rounded px-2 py-1 text-left text-sm hover:bg-surface-3"
                                >
                                    {acteur.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {scope === "aggregate" && (
                <div className="w-48">
                    <SelectLib
                        label="Législature"
                        options={MOCK_LEGISLATURES.map((n) => ({ value: String(n), label: `${n}ᵉ législature` }))}
                        value={value.filters?.legislature ? String(value.filters.legislature) : ""}
                        onChange={(v) => onChange("aggregate", { filters: { legislature: Number(v) } })}
                        placeholder="Choisir une législature"
                    />
                </div>
            )}
        </div>
    );
};
