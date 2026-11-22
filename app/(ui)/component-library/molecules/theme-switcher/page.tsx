"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { getThemeSwitcherSections } from "@/app/(ui)/component-library/molecules/theme-switcher/theme-switcher-lib.constants";

export default function ThemeSwitcherPage() {
    const sections = getThemeSwitcherSections();

    return (
        <div>
            <PageHeaderLib
                title="Theme Switcher"
                subtitle="Bouton flottant pour choisir le thème du site"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib
                        key={index}
                        title={section.title}
                        code={section.code}
                        description={section.description}
                    >
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
