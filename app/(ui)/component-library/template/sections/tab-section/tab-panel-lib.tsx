"use client";

import React from "react";
import { useTabSection } from "@/app/(ui)/component-library/template/sections/tab-section/tab-section-provider";
import { tabId, tabPanelId } from "@/app/(ui)/component-library/template/sections/tab-section/tab.types";
import { AnchorSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { AnchorSectionProvider } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-provider";
import { AnchorNavLib } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-nav-lib";

interface TabPanelLibProps {
    /** Id de l'onglet (celui passé à TabLayout / TabBarLib). */
    id: string;
    /**
     * Sections de l'onglet (ses sous-thèmes). À partir de deux, une nav latérale
     * les liste (AnchorNavLib : suit le défilement, un clic y mène) ; une seule
     * section s'affiche sur toute la largeur.
     */
    sections?: AnchorSection[];
    /** Titre de la nav des sections (défaut : "Sections"). */
    navLabel?: string;
    children: React.ReactNode;
}

/**
 * Panneau d'un onglet de TabLayout : visible seulement quand l'onglet est
 * ouvert. Les autres restent montés (données chargées une fois, changement
 * d'onglet instantané).
 */
export function TabPanelLib({ id, sections = [], navLabel, children }: TabPanelLibProps) {
    const { activeId } = useTabSection();
    // Les sections de l'onglet sont espacées par le conteneur (gap), pas par leurs marges.
    const contenu = <div className="tab-panel__sections">{children}</div>;
    return (
        <div role="tabpanel" id={tabPanelId(id)} aria-labelledby={tabId(id)} hidden={activeId !== id}>
            {sections.length > 1 ? (
                <AnchorSectionProvider initialId={sections[0].id}>
                    <div className="flex gap-8 items-start">
                        <aside className="hidden xl:block w-52 shrink-0 sticky top-8 self-start">
                            <AnchorNavLib sections={sections} label={navLabel} />
                        </aside>
                        <div className="flex-1 min-w-0">{contenu}</div>
                    </div>
                </AnchorSectionProvider>
            ) : (
                contenu
            )}
        </div>
    );
}
