"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getFormulaSections } from "@/app/(ui)/component-library/molecules/formula/formula-lib.constants";

export default function FormulaPage() {
    const sections = getFormulaSections();

    return (
        <div>
            <PageHeaderLib
                title="Formula"
                subtitle="Formule mathématique d'un indicateur, avec la légende de chacun de ses symboles"
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
