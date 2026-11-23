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
    /**
     * Colonnes sur mobile (grille < 520px). 2 : les tuiles d'une colonne passent
     * en demi-largeur, les plus larges en pleine largeur, rangées plus basses
     * (moins de place perdue qu'une tuile par ligne).
     */
    mobileColumns?: 1 | 2;
    className?: string;
    ariaLabel?: string;
};

/**
 * Grille « bento » : des tuiles de tailles variées (voir `BentoTileLib`),
 * placées dans l'ordre et tassées (`dense`). Responsive sur la largeur RÉELLE
 * de la grille (container query) : `columns` colonnes, puis 2, puis 1 ; les
 * tuiles plus larges que la grille sont ramenées à sa largeur.
 */
export function BentoGridLib({ children, columns = 4, rowMinHeight = 210, fill = false, mobileColumns = 1, className = "", ariaLabel }: BentoGridLibProps) {
    return (
        <div
            className={`bento-lib${fill ? " bento-lib--fill" : ""}${mobileColumns === 2 ? " bento-lib--mobile-2" : ""} ${className}`}
            aria-label={ariaLabel}
        >
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
    /**
     * Couleur de la tuile (une variable CSS du design system, ex. `var(--chart-3)`) :
     * halo dans le coin, bordure et ombre teintées au survol. Exposée aux enfants
     * en `--bento-tile-color` (icône, chiffre…).
     */
    color?: string;
    /**
     * Encre assortie à `color`, lisible sur la tuile et sur un fond teinté de
     * `color` (icône dans sa pastille, chiffre, plaque), exposée en
     * `--bento-tile-ink`. Utile quand `color` est trop clair pour du texte.
     */
    ink?: string;
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
    color,
    ink,
    loading = false,
    className = "",
    style,
}: BentoTileLibProps) {
    const classes = `bento-tile bento-tile--${variant} bento-tile--c${colSpan} bento-tile--r${rowSpan}${color ? " bento-tile--tinted" : ""}${loading ? " is-loading" : ""} ${className}`;
    const styles = color
        ? ({ ...style, "--bento-tile-color": color, ...(ink ? { "--bento-tile-ink": ink } : {}) } as React.CSSProperties)
        : style;

    if (loading) return <div className={classes} style={styles} aria-hidden="true" />;
    if (href) return <a href={href} className={`${classes} bento-tile--link`} style={styles}>{children}</a>;
    return <div className={classes} style={styles}>{children}</div>;
}
