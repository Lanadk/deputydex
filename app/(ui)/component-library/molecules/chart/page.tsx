import {PageHeaderLib} from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";
import {getChartSection} from "@/app/(ui)/component-library/molecules/chart/chart.constants";

export default function FilterBarPage() {

    const sections = getChartSection();

    return (
        <div>
            <PageHeaderLib
                title= "Chart"
                subtitle="Tous les composants de  visualisation des données"
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
    )
}