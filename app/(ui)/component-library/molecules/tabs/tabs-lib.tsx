"use client";

import React, { useRef } from "react";

export type TabLibItem = {
    id: string;
    label: string;
    /** Petite pastille après le libellé (ex. un nombre de mesures) */
    badge?: string | number;
};

interface TabsLibProps {
    tabs: TabLibItem[];
    activeId: string;
    onChange: (id: string) => void;
    /** Nom de la liste d'onglets pour les lecteurs d'écran */
    ariaLabel: string;
    /** Préfixe des id (onglet ↔ panneau), unique dans la page */
    idPrefix: string;
}

/** Attributs du panneau associé à un onglet (à poser sur le conteneur du contenu). */
export function tabPanelProps(idPrefix: string, id: string) {
    return {
        role: "tabpanel" as const,
        id: `${idPrefix}-panel-${id}`,
        "aria-labelledby": `${idPrefix}-tab-${id}`,
        tabIndex: 0,
    };
}

/**
 * Liste d'onglets accessible (motif ARIA « tabs ») : un seul onglet dans
 * l'ordre de tabulation, flèches gauche/droite, Début/Fin pour changer
 * d'onglet. Le contenu est rendu par l'appelant, avec `tabPanelProps`.
 */
export function TabsLib({ tabs, activeId, onChange, ariaLabel, idPrefix }: TabsLibProps) {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const select = (index: number) => {
        const tab = tabs[(index + tabs.length) % tabs.length];
        onChange(tab.id);
        refs.current[(index + tabs.length) % tabs.length]?.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "ArrowRight") select(index + 1);
        else if (e.key === "ArrowLeft") select(index - 1);
        else if (e.key === "Home") select(0);
        else if (e.key === "End") select(tabs.length - 1);
        else return;
        e.preventDefault();
    };

    return (
        <div className="tabs-lib" role="tablist" aria-label={ariaLabel}>
            {tabs.map((tab, i) => {
                const active = tab.id === activeId;
                return (
                    <button
                        key={tab.id}
                        ref={(el) => { refs.current[i] = el; }}
                        type="button"
                        role="tab"
                        id={`${idPrefix}-tab-${tab.id}`}
                        aria-selected={active}
                        aria-controls={`${idPrefix}-panel-${tab.id}`}
                        tabIndex={active ? 0 : -1}
                        className={`tabs-lib__tab ${active ? "tabs-lib__tab--active" : ""}`}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                    >
                        {tab.label}
                        {tab.badge !== undefined && <span className="tabs-lib__badge">{tab.badge}</span>}
                    </button>
                );
            })}
        </div>
    );
}
