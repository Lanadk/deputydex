"use client";

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { getTabSectionLibSections } from "@/app/(ui)/component-library/template/sections/tab-section/tab-section-lib.constants";

export default function TabSectionLibPage() {
    const sections = getTabSectionLibSections();

    return (
        <div>
            <PageHeaderLib
                title="Tab Section — Templates"
                subtitle="Layouts déclaratifs Config Driven : TabLayout"
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
