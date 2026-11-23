import React from "react";

export type BentoGridLibProps = {
    children: React.ReactNode;
    /** Colonnes sur grand écran (2 en largeur moyenne, 1 sur mobile). */
    columns?: 2 | 3 | 4;
    /** Hauteur minimale d'une rangée, en px. */
    rowMinHeight?: number;
    /**
     * Remplit la hauteur de son conteneur : les rangées s'étirent à parts égales
     * (sans descendre sous `rowMinHeight`). Le parent doit donner une hauteur
     * (ex. flex: 1 dans une colonne flex de hauteur fixe).
     */
    fill?: boolean;
    className?: string;
    ariaLabel?: string;
};

/**
 * Grille « bento » : des tuiles de tailles variées (voir `BentoTileLib`),
 * placées dans l'ordre et tassées (`dense`). Responsive sur la largeur RÉELLE
 * de la grille (container query) : `columns` colonnes, puis 2, puis 1 ; les
 * tuiles plus larges que la grille sont ramenées à sa largeur.
 */
export function BentoGridLib({ children, columns = 4, rowMinHeight = 210, fill = false, className = "", ariaLabel }: BentoGridLibProps) {
    return (
        <div className={`bento-lib${fill ? " bento-lib--fill" : ""} ${className}`} aria-label={ariaLabel}>
            <div
                className="bento-lib__grid"
                style={{ "--bento-columns": columns, "--bento-row": `${rowMinHeight}px` } as React.CSSProperties}
            >
                {children}
            </div>
        </div>
    );
}

export type BentoTileLibProps = {
    children?: React.ReactNode;
    /** Largeur en colonnes. */
    colSpan?: 1 | 2 | 3 | 4;
    /** Hauteur en rangées. */
    rowSpan?: 1 | 2;
    /** Tuile cliquable : lien (soulèvement et flèche au survol). */
    href?: string;
    /**
     * `glass` : verre translucide (le fond se devine derrière) ; `solid` : fond plein,
     * opaque ; `accent` : pleine couleur (appel à l'action).
     */
    variant?: "glass" | "solid" | "accent";
    /** En chargement : tuile vide à la même place, avec un reflet animé. */
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/** Une tuile de `BentoGridLib`. */
export function BentoTileLib({
    children,
    colSpan = 1,
    rowSpan = 1,
    href,
    variant = "glass",
    loading = false,
    className = "",
    style,
}: BentoTileLibProps) {
    const classes = `bento-tile bento-tile--${variant} bento-tile--c${colSpan} bento-tile--r${rowSpan}${loading ? " is-loading" : ""} ${className}`;

    if (loading) return <div className={classes} style={style} aria-hidden="true" />;
    if (href) return <a href={href} className={`${classes} bento-tile--link`} style={style}>{children}</a>;
    return <div className={classes} style={style}>{children}</div>;
}
