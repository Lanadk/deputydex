"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getAccordionSections } from "@/app/(ui)/component-library/molecules/accordion/accordion-lib.constants";

export default function AccordionPage() {
    const sections = getAccordionSections();

    return (
        <div>
            <PageHeaderLib
                title="Accordion"
                subtitle="Panneaux repliables accessibles : un en-tête cliquable par panneau"
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
