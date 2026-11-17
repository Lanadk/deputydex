"use client"

import { getGroupMiniCardSections } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib.constants";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function GroupMiniCardPage() {
    const sections = getGroupMiniCardSections();

    return (
        <div>
            <PageHeaderLib
                title="Group Mini Card"
                subtitle="Carte statique aux couleurs d'un groupe : mur de l'accueil et hémicycle"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib key={index} title={section.title} code={section.code}>
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
