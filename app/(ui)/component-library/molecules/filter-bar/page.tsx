"use client"

import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
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
    )
}