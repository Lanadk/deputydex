"use client";

import React from "react";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { AnchorSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { TabSectionProvider } from "@/app/(ui)/component-library/template/sections/tab-section/tab-section-provider";
import { TabBarLib } from "@/app/(ui)/component-library/template/sections/tab-section/tab-bar-lib";

interface TabLayoutProps {
    /** Titre affiché dans le PageHeaderLib (sans `header`) */
    title?: string;
    /** Sous-titre affiché dans le PageHeaderLib (sans `header`) */
    subtitle?: string;
    /** Header custom, toujours visible au-dessus des onglets */
    header?: React.ReactNode;
    /** Sections, une par onglet */
    sections: AnchorSection[];
    /** Nom accessible de la barre d'onglets (défaut : "Sections") */
    tabsLabel?: string;
    /** Contenu : une `TabPanelLib` par section, même `id` */
    children: React.ReactNode;
}

/**
 * TabLayout
 * Template générique : header pleine largeur, barre d'onglets, puis une
 * section à la fois sur toute la largeur. Pour une page trop longue en
 * défilement (comparer : AnchorLayout, toutes les sections et une nav latérale).
 *
 * Usage :
 *   <TabLayout header={<DeputeHeader … />} sections={SECTIONS}>
 *     {SECTIONS.map((s) => (
 *       <TabPanelLib key={s.id} id={s.id}>…</TabPanelLib>
 *     ))}
 *   </TabLayout>
 */
export function TabLayout({ title, subtitle, header, sections, tabsLabel, children }: TabLayoutProps) {
    return (
        <TabSectionProvider ids={sections.map((s) => s.id)}>
            <BaseLayout>
                {header ?? (
                    <div className="border-b border-main pb-6 mb-8">
                        <PageHeaderLib title={title!} subtitle={subtitle!} />
                    </div>
                )}

                <TabBarLib sections={sections} label={tabsLabel} />
                {children}
            </BaseLayout>
        </TabSectionProvider>
    );
}
