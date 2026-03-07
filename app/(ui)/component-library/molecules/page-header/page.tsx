"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { getPageHeaderSections } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib.constants";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";

export default function PageHeaderPage() {
    const sections = getPageHeaderSections();

    return (
        <div>
            <PageHeaderLib
                title="Page Header"
                subtitle="Composant header de page avec titre et sous-titre pour uniformiser les en-têtes"
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