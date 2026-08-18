"use client";

import React from "react";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export interface FilterGroupLibProps {
    /** Libellé affiché au-dessus du groupe (ex: "Législature", "Groupe", "Domaine") */
    label: string;
    /** Contrôles du groupe (boutons, select, input...) */
    children: React.ReactNode;
    /** Classes additionnelles pour le conteneur des enfants (par défaut : flex-wrap gap-2) */
    className?: string;
}

/**
 * Regroupe un ensemble de contrôles de filtre (boutons de choix, select,
 * champ de recherche...) sous un label explicite, avec une séparation
 * visuelle nette entre groupes voisins. Pensé pour les rangées de boutons
 * qui, seules, ne disent pas ce qu'elles filtrent (ex: les EntityResolver de
 * Statistiques — app/(ui)/components/statistics/entity-resolvers/ — ou les
 * tuiles de domaine de StatPicker) : on entoure les contrôles existants sans
 * changer leur logique, on ajoute juste le "quoi".
 */
export const FilterGroupLib: React.FC<FilterGroupLibProps> = ({ label, children, className }) => {
    return (
        <div className="filter-group-lib">
            <SpanLib className="filter-group-lib__label">{label}</SpanLib>
            <div className={`filter-group-lib__content flex flex-wrap gap-2 ${className ?? ""}`}>
                {children}
            </div>
        </div>
    );
};
