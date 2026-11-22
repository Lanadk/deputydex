"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getErrorStateSections } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib.constants";

export default function ErrorStatePage() {
    const sections = getErrorStateSections();

    return (
        <div>
            <PageHeaderLib
                title="ErrorState"
                subtitle="Erreur de chargement d'une section ou d'une liste, avec un bouton « Réessayer »"
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
