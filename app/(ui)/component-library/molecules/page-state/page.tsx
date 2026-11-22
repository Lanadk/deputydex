"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { getPageStateSections } from "@/app/(ui)/component-library/molecules/page-state/page-state-lib.constants";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function PageStatePage() {
    const sections = getPageStateSections();

    return (
        <div>
            <PageHeaderLib
                title="Page State"
                subtitle="État de page centré : 404, erreur, aucun résultat"
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
