"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { getBadgeSections } from "@/app/(ui)/component-library/atoms/badge/badge-lib.constants";
import { getArenaBadgeSections } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib.constants";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function BadgePage() {
    const sections = [...getBadgeSections(), ...getArenaBadgeSections()];

    return (
        <div>
            <PageHeaderLib
                title="Badge"
                subtitle="Labels, tags ou statuts, et badges d'arène pour les succès des députés"
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