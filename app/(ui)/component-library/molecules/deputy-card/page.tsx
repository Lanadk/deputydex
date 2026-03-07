"use client"

import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {getDeputyCardSections} from "@/app/(ui)/component-library/molecules/deputy-card/deputey-card-lib.constants";

export default function DeputyCardPage() {

    const sections = getDeputyCardSections();

    return (
        <div>
            <PageHeaderLib
                title="Deputy Card"
                subtitle="Carte de députés avec parti politique, nom et photo"
            />

            <PageContent>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContent>
        </div>
    );
}