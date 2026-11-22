"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getInfoTipSections } from "@/app/(ui)/component-library/molecules/info-tip/info-tip-lib.constants";

export default function InfoTipPage() {
    const sections = getInfoTipSections();

    return (
        <div>
            <PageHeaderLib
                title="InfoTip"
                subtitle="Icône « i » qui ouvre une bulle d'information (définition, explication)"
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
