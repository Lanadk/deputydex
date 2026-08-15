"use client"

import { useState } from 'react'
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { getCheckboxSections } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib.constants";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";

export default function CheckboxPage() {
    const [checked, setChecked] = useState(false);
    const [labelChecked, setLabelChecked] = useState(true);
    const [selected, setSelected] = useState<string[]>(["age"]);

    const toggle = (id: string) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    const sections = getCheckboxSections(checked, setChecked, labelChecked, setLabelChecked, selected, toggle);

    return (
        <div>
            <PageHeaderLib
                title="Checkbox"
                subtitle="Case à cocher pour sélection unitaire ou multiple"
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
    )
}
