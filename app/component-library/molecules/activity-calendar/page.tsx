"use client"

import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getActivityCalendarSections } from "@/app/component-library/molecules/activity-calendar/activity-calendar.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

export default function ActivityCalendarPage() {
    const sections = getActivityCalendarSections();

    return (
        <div>
            <PageHeader
                title="Activity Calendar"
                subtitle="Calendrier d'activité type GitHub pour visualiser les contributions"
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