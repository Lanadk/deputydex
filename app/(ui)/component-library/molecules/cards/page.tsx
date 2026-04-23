import {PageHeaderLib} from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {getCardsSections} from "@/app/(ui)/component-library/molecules/cards/cards-lib.constants";
export default function KpiCardPage() {
    const sections = getCardsSections();
    return (
        <div>
            <PageHeaderLib
                title="Button"
                subtitle="Composant bouton avec différentes variantes et options"
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
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";


import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
