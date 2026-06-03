"use client";

import React from "react";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {AnchorSectionProvider} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-provider";
import {AnchorSection} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import {AnchorNavLib} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-nav-lib";
import {BaseLayout} from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";

interface AnchorLayoutFixHeaderProps {
    /** Titre affiché dans le PageHeaderLib */
    title?: string;
    /** Sous-titre affiché dans le PageHeaderLib */
    subtitle?: string;
    /** Header custom */
    header?: React.ReactNode;
    /** Barre sticky insérée dans le flux du contenu (sous le header, au-dessus des children) */
    fixedBar?: React.ReactNode;
    /** Sections pour la nav ancre */
    sections: AnchorSection[];
    /** Label au-dessus de la nav (défaut : "Sections") */
    navLabel?: string;
    children: React.ReactNode;
}

export const AnchorLayoutFixHeader: React.FC<AnchorLayoutFixHeaderProps> = ({
                                                                                title,
                                                                                subtitle,
                                                                                sections,
                                                                                header,
                                                                                fixedBar,
                                                                                navLabel,
                                                                                children,
                                                                            }: AnchorLayoutFixHeaderProps) => {
    return (
        <AnchorSectionProvider initialId={sections[0]?.id}>
            <BaseLayout>
                {/* Header — soit custom, soit PageHeaderLib */}
                {header ?? (
                    <div className="border-b border-main pb-6 mb-8">
                        <PageHeaderLib title={title!} subtitle={subtitle!} />
                    </div>
                )}

                {/* ── Two-column : nav ancre sticky + contenu ── */}
                <div className="flex gap-8 items-start">
                    <aside className="hidden xl:block w-52 shrink-0 sticky top-8 self-start">
                        <AnchorNavLib sections={sections} label={navLabel} />
                    </aside>

                    <main className="flex-1 min-w-0 flex flex-col">
                        {fixedBar && (
                            <div className="sticky top-0 z-30 bg-background border-b border-main py-3 mb-6">
                                {fixedBar}
                            </div>
                        )}
                        {children}
                    </main>
                </div>
            </BaseLayout>
        </AnchorSectionProvider>
    );
};