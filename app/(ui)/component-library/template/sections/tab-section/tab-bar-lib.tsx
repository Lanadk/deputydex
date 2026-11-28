"use client";

import React, { useRef } from "react";
import { useTabSection } from "@/app/(ui)/component-library/template/sections/tab-section/tab-section-provider";
import { tabId, tabPanelId } from "@/app/(ui)/component-library/template/sections/tab-section/tab.types";
import { AnchorSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

interface TabBarLibProps {
    /** Une entrée par section : id, libellé, icône (mêmes sections que la page). */
    sections: AnchorSection[];
    /** Nom accessible de la liste d'onglets (défaut : "Sections"). */
    label?: string;
}

/**
 * Barre d'onglets d'un TabLayout : un onglet par section. Motif ARIA « tabs » :
 * flèches gauche / droite (en boucle), Début / Fin, activation immédiate.
 */
export function TabBarLib({ sections, label = "Sections" }: TabBarLibProps) {
    const { activeId, select } = useTabSection();
    const refs = useRef(new Map<string, HTMLButtonElement>());

    const activer = (index: number) => {
        const section = sections[(index + sections.length) % sections.length];
        select(section.id);
        refs.current.get(section.id)?.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent, index: number) => {
        const cible = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: sections.length - 1 }[e.key];
        if (cible === undefined) return;
        e.preventDefault();
        activer(cible);
    };

    return (
        <div role="tablist" aria-label={label} className="section-tabs">
            {sections.map(({ id, label: sectionLabel, icon: Icon }, index) => {
                const actif = activeId === id;
                return (
                    <button
                        key={id}
                        ref={(el) => {
                            if (el) refs.current.set(id, el);
                            else refs.current.delete(id);
                        }}
                        type="button"
                        role="tab"
                        id={tabId(id)}
                        aria-selected={actif}
                        aria-controls={tabPanelId(id)}
                        tabIndex={actif ? 0 : -1}
                        className="section-tabs__tab"
                        onClick={() => select(id)}
                        onKeyDown={(e) => onKeyDown(e, index)}
                    >
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{sectionLabel}</span>
                    </button>
                );
            })}
        </div>
    );
}
