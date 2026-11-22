"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getOrgChartSections } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib.constants";

export default function OrgChartPage() {
    const sections = getOrgChartSections();

    return (
        <div>
            <PageHeaderLib
                title="OrgChart"
                subtitle="Organigramme : arbre hiérarchique en listes imbriquées"
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
