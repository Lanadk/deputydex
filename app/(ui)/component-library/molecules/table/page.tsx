"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {getTableSections} from "@/app/(ui)/component-library/molecules/table/table-lib.constants";

export default function BadgePage() {
    const sections = getTableSections();

    return (
        <div>
            <PageHeaderLib
                title="Table"
                subtitle="Composant table pour des données dans un tableau paginé ou non"
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