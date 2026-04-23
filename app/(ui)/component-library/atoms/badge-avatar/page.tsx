"use client"

import { getAvatarSections } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib.constants";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {PageHeaderLib} from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";

export default function AvatarPage() {
    const sections = getAvatarSections();

    return (
        <div>
            <PageHeaderLib
                title="Avatar"
                subtitle="Composant avatar rond avec photo ou initiales en fallback"
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