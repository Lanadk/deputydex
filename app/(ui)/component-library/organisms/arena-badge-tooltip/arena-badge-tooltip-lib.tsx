"use client";

import React from "react";
import { ArenaBadgeLib, ArenaBadgeLibProps } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib";
import { ARENA_BADGE_STYLES } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib.variants";
import { TooltipLib, TooltipPlacement } from "@/app/(ui)/component-library/molecules/tooltip/tooltip-lib";

export type ArenaBadgeTooltipLibProps = ArenaBadgeLibProps & {
    /** Ce qu'il faut faire pour obtenir le badge */
    description?: React.ReactNode;
    /** Date d'obtention déjà formatée (ex. « 12 mars 2025 ») ; ignorée si `locked` */
    earnedOn?: string;
    /** Côté de la bulle (défaut : `top`) */
    placement?: TooltipPlacement;
};

/**
 * Badge d'arène dont la bulle (au survol et au focus clavier) donne le nom du
 * succès, sa règle et son état : obtenu (et quand) ou pas encore.
 */
export function ArenaBadgeTooltipLib({
    description,
    earnedOn,
    placement = "top",
    ...badge
}: ArenaBadgeTooltipLibProps) {
    const name = badge.label ?? ARENA_BADGE_STYLES[badge.variant].name;
    const status = badge.locked
        ? "Pas encore obtenu"
        : earnedOn ? `Obtenu le ${earnedOn}` : "Obtenu";

    const content = (
        <span className="arena-badge-tooltip-lib__bubble">
            <strong className="arena-badge-tooltip-lib__title">{name}</strong>
            {description && <span>{description}</span>}
            <span className={`arena-badge-tooltip-lib__status${badge.locked ? ' arena-badge-tooltip-lib__status--locked' : ''}`}>
                {status}
            </span>
        </span>
    );

    return (
        <TooltipLib content={content} placement={placement} delay={100}>
            {/* Déclencheur focusable : la bulle s'ouvre aussi au clavier (Tab). */}
            <span className="arena-badge-tooltip-lib" tabIndex={0}>
                <ArenaBadgeLib {...badge} />
            </span>
        </TooltipLib>
    );
}
