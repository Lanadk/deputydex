"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { getDifficultyGaugeSections } from "@/app/(ui)/component-library/molecules/difficulty-gauge/difficulty-gauge-lib.constants";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function DifficultyGaugePage() {
    const sections = getDifficultyGaugeSections();

    return (
        <div>
            <PageHeaderLib
                title="Difficulty Gauge"
                subtitle="Jauge de difficulté (1 à 5)"
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
