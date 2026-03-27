"use client";

import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib,
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {getGroupCardSections} from "@/app/(ui)/component-library/molecules/group-card/group-card-lib.constants";

export default function GroupCardPage() {
    const sections = getGroupCardSections();

    return (
        <div>
            <PageHeaderLib
                title="Groupe Card"
                subtitle="Carte de présentation d’un groupe parlementaire avec thème, logo et redirection optionnelle"
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