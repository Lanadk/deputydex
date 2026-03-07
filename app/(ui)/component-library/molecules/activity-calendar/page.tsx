"use client"

import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";
import { getActivityCalendarSections } from "@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar.constants-lib";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block-lib";

export default function ActivityCalendarPage() {
    const sections = getActivityCalendarSections();

    return (
        <div>
            <PageHeaderLib
                title="Activity Calendar"
                subtitle="Calendrier d'activité type GitHub pour visualiser les contributions"
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