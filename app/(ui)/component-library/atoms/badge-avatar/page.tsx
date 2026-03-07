"use client"

import { getAvatarSections } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib.constants";
import {
    ComponentSectionCodeBlock
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {PageHeader} from "@/app/(ui)/component-library/molecules/page-header/page-header";

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