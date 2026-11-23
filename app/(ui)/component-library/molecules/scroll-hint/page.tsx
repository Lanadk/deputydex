"use client"

import { getScrollHintSections } from "@/app/(ui)/component-library/molecules/scroll-hint/scroll-hint-lib.constants";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function ScrollHintPage() {
    const sections = getScrollHintSections();

    return (
        <div>
            <PageHeaderLib
                title="Scroll Hint"
                subtitle="Invitation animée à faire défiler, avec défilement doux jusqu'à une cible : bas du premier écran de l'accueil"
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
