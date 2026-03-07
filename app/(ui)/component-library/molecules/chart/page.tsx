import {PageHeader} from "@/app/(ui)/component-library/molecules/page-header/page-header";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block";
import {getChartSection} from "@/app/(ui)/component-library/molecules/chart/chart.constants";

export default function FilterBarPage() {

    const sections = getChartSection();

    return (
        <div>
            <PageHeader
                title= "Chart"
                subtitle="Tous les composants de  visualisation des données"
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
    )
}