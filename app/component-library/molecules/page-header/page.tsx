"use client"

import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getPageHeaderSections } from "@/app/component-library/molecules/page-header/page-header.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

export default function PageHeaderPage() {
    const sections = getPageHeaderSections();

    return (
        <div>
            <PageHeader
                title="Page Header"
                subtitle="Composant header de page avec titre et sous-titre pour uniformiser les en-têtes"
            />

            <PageContent>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlock
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlock>
                ))}
            </PageContent>
        </div>
    )
}