"use client"

import { useState } from 'react'
import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getSelectSections } from "@/app/component-library/molecules/select/select-lib.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

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
            <PageHeader
                title="Select"
                subtitle="Composant select avec options dynamiques pour filtres et sélection"
            />

            <PageContent>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlock
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlock>
                ))}
            </PageContent>
        </div>
    )
}