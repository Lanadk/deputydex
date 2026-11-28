"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { FilterGroupLib } from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib";
import { useLegislaturesList } from "@/app/(ui)/components/statistics/entity-resolvers/hook/use-legislatures-list";
import { PerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";

/** « Toutes (16ᵉ + 17ᵉ) » — construit depuis la liste des législatures disponibles, jamais en dur. */
export function libelleToutesLegislatures(numeros: number[]): string {
    const tries = [...numeros].sort((a, b) => a - b);
    return tries.length > 0 ? `Toutes (${tries.map((n) => `${n}ᵉ`).join(" + ")})` : "Toutes les législatures";
}

interface LegislatureChoiceButtonsProps {
    /** Périmètre actuellement choisi (`filters.legislature`). */
    value: unknown;
    /** Périmètre déjà pris par l'autre colonne en comparaison : grisé. */
    otherValue?: unknown;
    /** `undefined` = aucun filtre (bouton `sansFiltre`). */
    onSelect: (perimetre: PerimetreLegislature | undefined) => void;
    /** Ajoute le bouton « Toutes (…) » — voir EntityResolverProps.allowAllLegislatures. */
    allowAll?: boolean;
    /**
     * Libellé d'un premier bouton « sans filtre de législature » (ex: « Chaque
     * législature » pour un député : une série par législature). Absent = pas de
     * bouton, une législature est alors obligatoire.
     */
    sansFiltre?: string;
}

/**
 * Boutons de choix de la législature des EntityResolvers (une par législature
 * disponible, plus « Toutes » si le domaine a des stats qui l'acceptent).
 * La liste vient de `useLegislaturesList` : une nouvelle législature y
 * apparaît, et entre dans « Toutes », sans rien changer ici.
 */
export const LegislatureChoiceButtons: React.FC<LegislatureChoiceButtonsProps> = ({ value, otherValue, onSelect, allowAll = false, sansFiltre }) => {
    const legislatures = useLegislaturesList();

    return (
        <FilterGroupLib label="Législature">
            {sansFiltre && (
                <ButtonLib
                    text={sansFiltre}
                    size="small"
                    variant={value == null ? "primary" : "tertiary"}
                    onClick={() => onSelect(undefined)}
                />
            )}
            {legislatures.map((l) => (
                <ButtonLib
                    key={l.id}
                    text={`${l.number}ᵉ législature`}
                    size="small"
                    variant={value === l.number ? "primary" : "tertiary"}
                    disabled={l.number === otherValue}
                    onClick={() => onSelect(l.number)}
                />
            ))}
            {allowAll && legislatures.length > 1 && (
                <ButtonLib
                    text={libelleToutesLegislatures(legislatures.map((l) => l.number))}
                    size="small"
                    variant={value === TOUTES_LEGISLATURES ? "primary" : "tertiary"}
                    disabled={otherValue === TOUTES_LEGISLATURES}
                    onClick={() => onSelect(TOUTES_LEGISLATURES)}
                />
            )}
        </FilterGroupLib>
    );
};
