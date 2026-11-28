"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getComingSoonSections } from "@/app/(ui)/component-library/molecules/coming-soon/coming-soon-lib.constants";

export default function ComingSoonPage() {
    const sections = getComingSoonSections();

    return (
        <div>
            <PageHeaderLib
                title="Coming soon"
                subtitle="Aperçu flouté d'un contenu à venir, sous une mention « Disponible bientôt »"
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
