"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { getBadgeSections } from "@/app/(ui)/component-library/atoms/badge/badge-lib.constants";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function BadgePage() {
    const sections = getBadgeSections();

    return (
        <div>
            <PageHeaderLib
                title="Badge"
                subtitle="Composant badge pour afficher des labels, tags ou statuts"
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