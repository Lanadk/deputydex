"use client";

import React from "react";
import { ScrutinHemicyclePlan } from "@/app/(ui)/components/scrutins/scrutin-hemicycle-plan";
import { HemicycleConfig, HemicycleDataWrapper } from "@/app/(ui)/component-library/template/sections/block-section/hemicycle-config.types";

interface BlockHemicycleRendererProps {
    config: HemicycleConfig;
    data: HemicycleDataWrapper | null;
    loading: boolean;
}

/**
 * Bloc "hemicycle" : plan 3D de la salle (composants de l'hémicycle, #176) avec
 * un siège coloré par député. La taille d'affichage est fixée ici par le
 * conteneur ; la donnée (`HemicycleDataWrapper`) ne dépend pas du composant.
 */
export function BlockHemicycleRenderer({ config, data, loading }: BlockHemicycleRendererProps) {
    return (
        <div className="chart-lib flex flex-col gap-3">
            {data && data.seats.length > 0 ? (
                // Les sièges sont en % du plan : plus le plan est large, plus ils sont
                // gros (et faciles à survoler). Toute la largeur du bloc, 896 px au plus.
                <div className="mx-auto w-full max-w-4xl">
                    {/* Titre et sous-titre optionnels du bloc, centrés au-dessus du plan */}
                    <ScrutinHemicyclePlan
                        seats={data.seats}
                        legend={data.legend}
                        ariaLabel={data.ariaLabel}
                        title={config.title}
                        subtitle={config.subtitle}
                        seatScale={config.seatScale}
                    />
                </div>
            ) : (
                <p className="text-sm text-gray-500">{loading ? "Chargement…" : "Plan de l'hémicycle indisponible pour ce scrutin."}</p>
            )}
        </div>
    );
}
