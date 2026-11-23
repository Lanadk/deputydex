"use client"

import { getDeviceFrameSections } from "@/app/(ui)/component-library/molecules/device-frame/device-frame-lib.constants";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import {
    ComponentSectionCodeBlockLib
} from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";

export default function DeviceFramePage() {
    const sections = getDeviceFrameSections();

    return (
        <div>
            <PageHeaderLib
                title="Device Frame"
                subtitle="Cadre de tablette ou de téléphone autour d'un contenu : maquette de l'app sur l'accueil"
            />

            <PageContentLib>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlockLib key={index} title={section.title} code={section.code}>
                        {section.component}
                    </ComponentSectionCodeBlockLib>
                ))}
            </PageContentLib>
        </div>
    );
}
