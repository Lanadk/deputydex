"use client"

import { getAvatarSections } from "@/app/component-library/atoms/badge-avatar/avatar-picture-lib.constants";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {PageHeader} from "@/app/component-library/molecules/page-header/page-header";

export default function AvatarPage() {
    const sections = getAvatarSections();

    return (
        <div>
            <PageHeader
                title="Avatar"
                subtitle="Composant avatar rond avec photo ou initiales en fallback"
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