"use client";

import React from "react";
import { HemicycleLib } from "@/app/(ui)/component-library/molecules/hemicycle/hemicycle-lib";
import { HemicycleConfig, HemicycleDataWrapper } from "@/app/(ui)/component-library/template/sections/block-section/hemicycle-config.types";

interface BlockHemicycleRendererProps {
    config: HemicycleConfig;
    data: HemicycleDataWrapper | null;
    loading: boolean;
}

/**
 * Bloc "hemicycle". Seul point de contact avec le composant de rendu :
 * `HemicycleLib` est provisoire, en attendant le plan de la branche
 * feat/accueil-hemicycle. Pour le remplacer, ne changer que l'import et l'appel
 * ci-dessous : la donnée (`HemicycleDataWrapper`) et la taille d'affichage,
 * fixée ici par le conteneur, ne dépendent pas du composant.
 */
export function BlockHemicycleRenderer({ config, data, loading }: BlockHemicycleRendererProps) {
    return (
        <div className="chart-lib flex flex-col gap-3">
            {(config.title || config.subtitle) && (
                <div className="chart-lib__header">
                    {config.title && <span className="chart-lib__title">{config.title}</span>}
                    {config.subtitle && <span className="chart-lib__subtitle text-xs">{config.subtitle}</span>}
                </div>
            )}

            {data && data.seats.length > 0 ? (
                <div className="mx-auto w-full max-w-xl">
                    <HemicycleLib seats={data.seats} legend={data.legend} ariaLabel={data.ariaLabel} />
                </div>
            ) : (
                <p className="text-sm text-gray-500">{loading ? "Chargement…" : "Plan de l'hémicycle indisponible pour ce scrutin."}</p>
            )}
        </div>
    );
}
