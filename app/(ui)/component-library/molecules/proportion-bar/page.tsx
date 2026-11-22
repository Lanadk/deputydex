"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getProportionBarSections } from "@/app/(ui)/component-library/molecules/proportion-bar/proportion-bar-lib.constants";

export default function ProportionBarPage() {
    const sections = getProportionBarSections();

    return (
        <div>
            <PageHeaderLib
                title="ProportionBar"
                subtitle="Répartition d'un total en une seule barre, avec sa légende"
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
