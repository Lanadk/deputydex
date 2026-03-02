"use client"

import { useState } from 'react'
import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getInputSections } from "@/app/component-library/molecules/input/input-lib.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

export default function InputPage() {
    const [searchValue, setSearchValue] = useState('')
    const [filterValue, setFilterValue] = useState('')
    const [disabledValue] = useState('Read only value')

    const sections = getInputSections(
        searchValue,
        setSearchValue,
        filterValue,
        setFilterValue,
        disabledValue
    );

    return (
        <div>
            <PageHeader
                title="Input"
                subtitle="Composant input pour recherche, filtres et saisie"
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