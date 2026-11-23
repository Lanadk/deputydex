import React, { useId } from "react";
import {
    ARENA_BADGE_STYLES,
    ArenaBadgeVariant,
} from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib.variants";

export type ArenaBadgeLibProps = {
    /** Type de badge : forme, relief et couleurs */
    variant: ArenaBadgeVariant;
    /** Libellé sous le badge (par défaut : le nom du variant) */
    label?: string;
    /** Largeur en pixels (96 par défaut) */
    size?: number;
    /** Badge pas encore obtenu : grisé */
    locked?: boolean;
    /** Masque le libellé visible (il reste le nom accessible) */
    hideLabel?: boolean;
};

/**
 * Badge d'arène : une médaille en relief (cerclage, face en dégradé, facettes,
 * reflet) dont la forme et les couleurs dépendent du variant.
 */
export const ArenaBadgeLib: React.FC<ArenaBadgeLibProps> = ({
    variant,
    label,
    size = 96,
    locked = false,
    hideLabel = false,
}) => {
    const id = `arena-badge-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const style = ARENA_BADGE_STYLES[variant];
    const name = label ?? style.name;
    const horizontal = style.gradient === 'horizontal';

    return (
        <figure
            className={`arena-badge-lib${locked ? ' arena-badge-lib--locked' : ''}`}
            style={{ '--arena-badge-size': `${size}px` } as React.CSSProperties}
        >
            <svg
                viewBox="0 0 100 100"
                role="img"
                aria-label={locked ? `${name} (non obtenu)` : name}
                className="arena-badge-lib__svg"
            >
                <defs>
                    <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2={horizontal ? '0' : '1'}>
                        <stop offset="0%" style={{ stopColor: style.face[0] }} />
                        <stop offset="50%" style={{ stopColor: style.face[1] }} />
                        <stop offset="100%" style={{ stopColor: style.face[2] }} />
                    </linearGradient>
                    <clipPath id={`${id}-clip`}>
                        <path d={style.shape} />
                    </clipPath>
                </defs>

                <path d={style.shape} className="arena-badge-lib__outline" />
                <path d={style.shape} className="arena-badge-lib__rim" style={{ fill: style.rim, stroke: style.rim }} />
                <path d={style.shape} fill={`url(#${id}-face)`} />

                <g clipPath={`url(#${id}-clip)`}>
                    <path d={style.facets} className="arena-badge-lib__facets" style={{ stroke: style.rim }} />
                    <ellipse cx="34" cy="26" rx="30" ry="12" transform="rotate(-25 34 26)" className="arena-badge-lib__shine" />
                    <g className="arena-badge-lib__glint">
                        <rect x="-10" y="-30" width="12" height="160" transform="rotate(20 50 50)" />
                    </g>
                </g>
            </svg>
            {/* Nom déjà porté par l'aria-label du SVG : pas de double lecture. */}
            {!hideLabel && <figcaption className="arena-badge-lib__label" aria-hidden="true">{name}</figcaption>}
        </figure>
    );
};
