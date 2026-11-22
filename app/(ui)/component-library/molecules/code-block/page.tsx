"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getCodeBlockSections } from "@/app/(ui)/component-library/molecules/code-block/code-block-lib.constants";

export default function CodeBlockPage() {
    const sections = getCodeBlockSections();

    return (
        <div>
            <PageHeaderLib
                title="Code Block"
                subtitle="Aperçu d'un composant avec son code, utilisé par les pages de cette librairie"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib
                        key={index}
                        title={section.title}
                        code={section.code}
                        description={section.description}
                    >
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
