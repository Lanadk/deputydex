"use client";

import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {
    getBlockSectionLibSections
} from "@/app/(ui)/component-library/template/block-section/block-section-lib.constants";

export default function BlockSectionLibPage() {
    const sections = getBlockSectionLibSections();

    return (
        <div>
            <PageHeaderLib
                title="Block Section — Templates"
                subtitle="Layouts déclaratifs Config Driven : SectionBlock, Paragraph, Table, Chart Renderer"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib
                        key={index}
                        title={section.title}
                        code={section.code}
                        description={section.description}
                    >
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}