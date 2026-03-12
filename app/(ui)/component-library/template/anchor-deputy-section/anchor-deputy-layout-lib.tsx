"use client";

import React from "react";
import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { AnchorSectionProvider } from "@/app/(ui)/component-library/template/anchor-section/anchor-section-provider";
import { AnchorSection } from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import { AnchorNavLib } from "@/app/(ui)/component-library/template/anchor-section/anchor-nav-lib";

interface AcnhorDeputeTemplateLibProps {
    title: string;
    subtitle: string;
    sections: AnchorSection[];
    navLabel?: string;
    /** Slot card député — DeputyCardLib ou autre */
    card: React.ReactNode;
    children: React.ReactNode;
}

/**
 * AnchorDeputeTemplateLib
 * Template fiche député : header pleine largeur + aside sticky (card + nav ancre) + contenu.
 *
 * Usage :
 *   <AnchorDeputeTemplateLib
 *       title="Jean Dupont"
 *       subtitle="3e circonscription du Rhône"
 *       sections={DEPUTE_SECTIONS}
 *       card={<DeputyCardLib nom="Jean Dupont" groupe="EPR" image="..." />}
 *   >
 *       {children}
 *   </AnchorDeputeTemplateLib>
 */
export const AnchorDeputeTemplateLib: React.FC<AcnhorDeputeTemplateLibProps> = ({
                                                                    title,
                                                                    subtitle,
                                                                    sections,
                                                                    navLabel,
                                                                    card,
                                                                    children,
                                                                }) => {
    return (
        <AnchorSectionProvider initialId={sections[0]?.id}>
            <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

                    {/* Header pleine largeur */}
                    <div className="border-b border-main pb-6 mb-8">
                        <PageHeaderLib title={title} subtitle={subtitle} />
                    </div>

                    {/* Two-column : aside sticky + contenu */}
                    <div className="flex gap-8 items-start">

                        {/* Aside : card + nav */}
                        <aside className="hidden xl:flex xl:flex-col gap-4 w-52 shrink-0 sticky top-8 self-start">
                            {/* Card député */}
                            <div className="w-full">
                                {card}
                            </div>

                            {/* Nav ancre */}
                            <AnchorNavLib sections={sections} label={navLabel} />
                        </aside>

                        {/* Contenu principal */}
                        <main className="flex-1 min-w-0">
                            {children}
                        </main>

                    </div>
                </div>
            </div>
        </AnchorSectionProvider>
    );
};