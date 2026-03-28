"use client";

import React from "react";
import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import {AnchorSectionProvider} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-provider";
import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {AnchorNavLib} from "@/app/(ui)/component-library/template/anchor-section/anchor-nav-lib";
import {BaseLayout} from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";

interface AnchorLayoutProps {
    /** Titre affiché dans le PageHeaderLib */
    title: string;
    /** Sous-titre affiché dans le PageHeaderLib */
    subtitle: string;
    /** Sections pour la nav ancre */
    sections: AnchorSection[];
    /** Label au-dessus de la nav (défaut : "Sections") */
    navLabel?: string;
    children: React.ReactNode;
}

/**
 * AnchorLayoutLib
 * Template générique : header pleine largeur + nav ancre sticky + contenu.
 *
 * Usage :
 *   <AnchorLayoutLib title="Statistiques" subtitle="..." sections={STATISTICS_SECTIONS}>
 *     {children}
 *   </AnchorLayoutLib>
 *
 *   <AnchorLayoutLib title="Député" subtitle="..." sections={DEPUTE_SECTIONS}>
 *     {children}
 *   </AnchorLayoutLib>
 */
export const AnchorLayout: React.FC<AnchorLayoutProps> = ({
                                                                    title,
                                                                    subtitle,
                                                                    sections,
                                                                    navLabel,
                                                                    children,
                                                                }: AnchorLayoutProps) => {
    return (
        <AnchorSectionProvider initialId={sections[0]?.id}>
            <BaseLayout>
                {/* ── Header pleine largeur ── */}
                <div className="border-b border-main pb-6 mb-8">
                    <PageHeaderLib title={title} subtitle={subtitle} />
                </div>

                {/* ── Two-column : nav ancre sticky + contenu ── */}
                <div className="flex gap-8 items-start">

                    <aside className="hidden xl:block w-52 shrink-0 sticky top-8 self-start">
                        <AnchorNavLib sections={sections} label={navLabel} />
                    </aside>

                    <main className="flex-1 min-w-0">
                        {children}
                    </main>

                </div>
            </BaseLayout>
        </AnchorSectionProvider>
    );
};