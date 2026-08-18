"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { getFilterGroupSections } from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib.constants";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";

export default function FilterGroupPage() {
    const sections = getFilterGroupSections();

    return (
        <div>
            <PageHeaderLib
                title="Filter Group"
                subtitle="Label générique au-dessus d'un groupe de contrôles de filtre, avec séparation visuelle claire entre groupes voisins"
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
