import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {getKpiCardSections} from "@/app/(ui)/component-library/molecules/kpi-card/kpi-card.constants";


export default function KpiCardPage() {
    const sections = getKpiCardSections();
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