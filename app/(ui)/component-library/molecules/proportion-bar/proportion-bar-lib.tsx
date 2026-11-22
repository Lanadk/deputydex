import React from "react";

export type ProportionSegment = {
    id: string;
    label: string;
    value: number;
    /** Couleur du segment (ex. `var(--chart-1)`). */
    color: string;
};

export type ProportionBarLibProps = {
    segments: ProportionSegment[];
    /** Phrase qui résume ce que la barre répartit (lue par les lecteurs d'écran). */
    ariaLabel: string;
};

const PERCENT = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 0 });

/**
 * Répartition d'un total en une seule barre : chaque segment a la largeur de sa
 * part, et la légende donne libellé, valeur et pourcentage. Plus lisible qu'un
 * tableau pour quelques catégories (jusqu'à sept ou huit).
 */
export function ProportionBarLib({ segments, ariaLabel }: ProportionBarLibProps) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const visible = segments.filter((s) => s.value > 0);
    if (total === 0) return null;

    return (
        <figure className="proportion-bar-lib" aria-label={ariaLabel}>
            <div className="proportion-bar-lib__bar" aria-hidden="true">
                {visible.map((s) => (
                    <span
                        key={s.id}
                        className="proportion-bar-lib__segment"
                        style={{ flexGrow: s.value, backgroundColor: s.color }}
                        title={`${s.label} : ${s.value} (${PERCENT.format(s.value / total)})`}
                    />
                ))}
            </div>
            <ul className="proportion-bar-lib__legend">
                {visible.map((s) => (
                    <li key={s.id} className="proportion-bar-lib__item">
                        <span className="proportion-bar-lib__dot" style={{ backgroundColor: s.color }} aria-hidden="true" />
                        <span className="proportion-bar-lib__label">{s.label}</span>
                        <span className="proportion-bar-lib__value">{s.value.toLocaleString("fr-FR")}</span>
                        <span className="proportion-bar-lib__percent">{PERCENT.format(s.value / total)}</span>
                    </li>
                ))}
            </ul>
        </figure>
    );
}
