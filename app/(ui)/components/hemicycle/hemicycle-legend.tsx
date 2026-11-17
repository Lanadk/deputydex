"use client";

import React from "react";
import { HemicycleGroupe } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

type HemicycleLegendProps = {
    groupes: HemicycleGroupe[];
    selectedCode: string | null;
    onToggleAction: (code: string) => void;
};

/**
 * Un vrai `<button aria-pressed>` par groupe (Entrée/Espace natifs). Un second
 * clic sur le groupe sélectionné le désélectionne (géré par l'appelant).
 */
export function HemicycleLegend({ groupes, selectedCode, onToggleAction }: HemicycleLegendProps) {
    return (
        <div className="hemicycle-legend" role="group" aria-label="Groupes parlementaires">
            {groupes.map((groupe) => {
                const theme = getGroupCardTheme(getCanonicalGroupCode(groupe.code));

                return (
                    <button
                        key={groupe.code}
                        type="button"
                        className="hemicycle-legend__btn"
                        aria-pressed={selectedCode === groupe.code}
                        aria-label={`${groupe.label} : ${groupe.count} sièges`}
                        title={groupe.label}
                        style={{ "--group-color": theme.border } as React.CSSProperties}
                        onClick={() => onToggleAction(groupe.code)}
                    >
                        <span
                            className="hemicycle-legend__dot"
                            style={{ background: `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})` }}
                        />
                        <span>{groupe.shortLabel}</span>
                        <span className="hemicycle-legend__count">{groupe.count}</span>
                    </button>
                );
            })}
        </div>
    );
}
