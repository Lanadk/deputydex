"use client"

import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { ComponentSectionCodeBlock } from "@/app/component-library/molecules/component-section/component-section-code-block";
import { getBadgeSections } from "@/app/component-library/atoms/badge/badge-lib.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";

export default function BadgePage() {
    const sections = getBadgeSections();

    return (
        <div>
            <PageHeader
                title="Badge"
                subtitle="Composant badge pour afficher des labels, tags ou statuts"
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