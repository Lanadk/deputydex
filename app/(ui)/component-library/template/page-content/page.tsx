"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getPageContentSections } from "@/app/(ui)/component-library/template/page-content/page-content-lib.constants";

export default function PageContentPage() {
    const sections = getPageContentSections();

    return (
        <div>
            <PageHeaderLib
                title="Page Content"
                subtitle="Empile les sections d'une page avec un espacement régulier"
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
