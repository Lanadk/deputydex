"use client"

import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {getFilterBarSections} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.constants";

export default function FilterBarPage() {

    const sections = getFilterBarSections();

    return (
        <div>
            <PageHeaderLib
                title= "Filter Bar"
                subtitle="Barre de filtre"
            />

            <PageContent>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContent>
        </div>
    )
}