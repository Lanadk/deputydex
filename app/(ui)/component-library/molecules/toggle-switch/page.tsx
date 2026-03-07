"use client"

import { useState } from "react";
import { PageHeader } from "@/app/(ui)/component-library/molecules/page-header/page-header";
import { getToggleSwitchSections } from "@/app/(ui)/component-library/molecules/toggle-switch/toggle-switch-lib.constants";
import {PageContent} from "@/app/(ui)/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/(ui)/component-library/molecules/component-section/component-section-code-block";

export default function ToggleSwitchPage() {
    const [isWifiOn, setIsWifiOn] = useState(false);
    const [isBluetoothOn, setIsBluetoothOn] = useState(true);
    const [isNotificationsOn, setIsNotificationsOn] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isMedium, setIsMedium] = useState(false);

    const sections = getToggleSwitchSections(
        isSmall,
        setIsSmall,
        isMedium,
        setIsMedium,
        isWifiOn,
        setIsWifiOn,
        isBluetoothOn,
        setIsBluetoothOn,
        isNotificationsOn,
        setIsNotificationsOn
    );

    return (
        <div>
            <PageHeader
                title="Toggle Switch"
                subtitle="Composant toggle switch style iOS pour activer/désactiver des options"
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