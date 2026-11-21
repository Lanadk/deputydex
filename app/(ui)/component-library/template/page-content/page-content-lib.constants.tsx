"use client"

import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { WireBox } from "@/app/(ui)/component-library/template/debug/wireframe/wire-frame.utils";

const CODE_PAGE_CONTENT = `<PageContentLib>
    <SectionA />
    <SectionB />
    <SectionC />
</PageContentLib>`;

export const getPageContentSections = () => [
    {
        title: "Empilement vertical",
        description: "Empile ses enfants avec un espacement régulier (space-y-8). Chaque page de cette librairie l'utilise pour aligner ses sections de démo.",
        code: CODE_PAGE_CONTENT,
        component: (
            <PageContentLib>
                <WireBox label="Section A" height="h-12" />
                <WireBox label="Section B" height="h-12" />
                <WireBox label="Section C" height="h-12" />
            </PageContentLib>
        ),
    },
];
