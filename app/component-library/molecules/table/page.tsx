"use client"

import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { ComponentSectionCodeBlock } from "@/app/component-library/molecules/component-section/component-section-code-block";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {getTableSections} from "@/app/component-library/molecules/table/table-lib.constants";

export default function BadgePage() {
    const sections = getTableSections();

    return (
        <div>
            <PageHeader
                title="Table"
                subtitle="Composant table pour des données dans un tableau paginé ou non"
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