"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getSpinnerSections } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib.constants";

export default function SpinnerPage() {
    const sections = getSpinnerSections();

    return (
        <div>
            <PageHeaderLib
                title="Spinner"
                subtitle="Indicateur de chargement circulaire aux couleurs du thème"
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
