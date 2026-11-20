"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getHemicycleSections } from "@/app/(ui)/component-library/molecules/hemicycle/hemicycle-lib.constants";

export default function HemicyclePage() {
    const sections = getHemicycleSections();

    return (
        <div>
            <PageHeaderLib
                title="Hemicycle"
                subtitle="Plan de l'hémicycle : un point coloré par siège, de la gauche vers la droite de la salle, avec info-bulle au survol et légende cliquable"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
