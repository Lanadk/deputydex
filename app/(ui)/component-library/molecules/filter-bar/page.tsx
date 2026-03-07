"use client"

import {PageHeader} from "@/app/(ui)/component-library/molecules/page-header/page-header";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block";
import {getFilterBarSections} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.constants";

export default function FilterBarPage() {

    const sections = getFilterBarSections();

    return (
        <div>
            <PageHeader
                title= "Filter Bar"
                subtitle="Barre de filtre"
            />

            <PageContent>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlock
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlock>
                ))}
            </PageContent>
        </div>
    )
}