"use client"

import { getBentoSections } from "@/app/(ui)/component-library/molecules/bento/bento-lib.constants";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function BentoPage() {
    const sections = getBentoSections();

    return (
        <div>
            <PageHeaderLib
                title="Bento"
                subtitle="Grille de tuiles de tailles variées, en verre ou pleine couleur : l'actu de l'accueil"
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
