"use client"



import {getDeputyCardSections} from "@/app/(ui)/component-library/molecules/deputy/deputy-card.constants";
import {PageHeaderLib} from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function DeputyCardPage() {

    const sections = getDeputyCardSections();

    return (
        <div>
            <PageHeaderLib
                title="Deputy Card"
                subtitle="Carte de députés avec parti politique, nom et photo"
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