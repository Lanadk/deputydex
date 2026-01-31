"use client"

import { useState } from "react";
import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getButtonSections } from "@/app/component-library/atoms/button/button-lib.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

export default function ButtonPage() {
    const [message, setMessage] = useState('');
    const sections = getButtonSections(message, setMessage);

    return (
        <div>
            <PageHeader
                title="Button"
                subtitle="Composant bouton avec différentes variantes et options"
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
    );
}