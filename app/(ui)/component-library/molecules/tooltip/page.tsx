"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getTooltipSections } from "@/app/(ui)/component-library/molecules/tooltip/tooltip-lib.constants";

export default function TooltipPage() {
    const sections = getTooltipSections();

    return (
        <div>
            <PageHeaderLib
                title="Tooltip"
                subtitle="Bulle d'aide courte, au survol et au focus clavier (libellé d'une icône) : menu replié"
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
