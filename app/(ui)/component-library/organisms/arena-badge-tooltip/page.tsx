"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getArenaBadgeTooltipSections } from "@/app/(ui)/component-library/organisms/arena-badge-tooltip/arena-badge-tooltip-lib.constants";

export default function ArenaBadgeTooltipPage() {
    const sections = getArenaBadgeTooltipSections();

    return (
        <div>
            <PageHeaderLib
                title="ArenaBadgeTooltip"
                subtitle="Badge d'arène avec bulle au survol : nom du succès, règle, date d'obtention"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib key={index} title={section.title} code={section.code}>
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
