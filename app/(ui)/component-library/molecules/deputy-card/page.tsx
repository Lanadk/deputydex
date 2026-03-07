"use client"

import {PageHeader} from "@/app/(ui)/component-library/molecules/page-header/page-header";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block";
import {getDeputyCardSections} from "@/app/(ui)/component-library/molecules/deputy-card/deputey-card.constants";

export default function DeputyCardPage() {

    const sections = getDeputyCardSections();

    return (
        <div>
            <PageHeader
                title="Deputy Card"
                subtitle="Carte de députés avec parti politique, nom et photo"
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
    );
}