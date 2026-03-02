"use client"

import { useState } from "react";
import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getSpanSections } from "@/app/component-library/atoms/span/span-lib.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

export default function SpanPage() {
    const [clickCount, setClickCount] = useState(0);
    const sections = getSpanSections(clickCount, setClickCount);

    return (
        <div>
            <PageHeader
                title="Span"
                subtitle="Composant span inline avec support de texte, children et icônes"
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