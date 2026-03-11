"use client";

import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {
    getAnchorSectionLibSections
} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-lib.constants";


export default function AnchorSectionLibPage() {
    const sections = getAnchorSectionLibSections();

    return (
        <div>
            <PageHeaderLib
                title="Anchor Section — Templates"
                subtitle="Layouts déclaratifs Config Driven : AnchorLayout"
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