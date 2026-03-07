"use client"

import { useState } from 'react'
import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { getInputSections } from "@/app/(ui)/component-library/molecules/input/input-lib.constants";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";

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
            <PageHeaderLib
                title="Input"
                subtitle="Composant input pour recherche, filtres et saisie"
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