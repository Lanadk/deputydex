"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getCalloutSections } from "@/app/(ui)/component-library/molecules/callout/callout-lib.constants";

export default function CalloutPage() {
    const sections = getCalloutSections();

    return (
        <div>
            <PageHeaderLib
                title="Callout"
                subtitle="Encadré « Remarque / Info / Attention » pour prévenir le lecteur dans une page"
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
