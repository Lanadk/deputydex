"use client"

import { useState } from 'react'
import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { getSelectSections } from "@/app/(ui)/component-library/molecules/select/select-lib.constants";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";

export default function SelectPage() {
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [category, setCategory] = useState('')

    const sections = getSelectSections(
        country,
        setCountry,
        city,
        setCity,
        category,
        setCategory
    );

    return (
        <div>
            <PageHeaderLib
                title="Select"
                subtitle="Composant select avec options dynamiques pour filtres et sélection"
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
    )
}