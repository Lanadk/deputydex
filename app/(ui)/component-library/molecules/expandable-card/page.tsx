"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getExpandableCardSections } from "@/app/(ui)/component-library/molecules/expandable-card/expandable-card-lib.constants";

export default function ExpandableCardPage() {
    const sections = getExpandableCardSections();

    return (
        <div>
            <PageHeaderLib
                title="ExpandableCard"
                subtitle="Carte dépliable d'un dossier législatif : résumé, rôles, compteurs et détail chargé à la demande"
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
