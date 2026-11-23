"use client"

import { getScrollProgressSections } from "@/app/(ui)/component-library/molecules/scroll-progress/scroll-progress-lib.constants";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function ScrollProgressPage() {
    const sections = getScrollProgressSections();

    return (
        <div>
            <PageHeaderLib
                title="Scroll Progress"
                subtitle="Barre verticale qui suit la position de la vue dans la page, un point par section : bord droit de l'accueil"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib key={index} title={section.title} code={section.code}>
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
