import React from "react";
import {WireBox, WireLabel} from "@/app/(ui)/component-library/template/debug/wireframe/wire-frame.utils";


//Wireframes
const WireframeAnchorLayout = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden" style={{ borderStyle: "dashed" }}>
        {/* PageHeader */}
        <div className="px-4 py-3 border-b border-main" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
            <div className="flex items-center gap-2">
                <WireLabel>PageHeaderLib</WireLabel>
                <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
            </div>
            <div className="h-2 w-48 rounded mt-1.5" style={{ backgroundColor: "var(--surface-3)" }} />
        </div>

        {/* Layout body */}
        <div className="flex gap-0">
            {/* Aside nav */}
            <div className="w-44 shrink-0 border-r border-main p-3 flex flex-col gap-2" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
                <WireLabel>AnchorNavLib</WireLabel>
                {["Section 1", "Section 2", "Section 3"].map((s, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
                        style={{
                            backgroundColor: i === 0 ? "var(--accent)" : "transparent",
                            color: i === 0 ? "white" : "var(--subtitle-accent)",
                        }}
                    >
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: i === 0 ? "white" : "var(--surface-3)" }} />
                        {s}
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-4 flex flex-col gap-4">
                <WireLabel>children (page.tsx)</WireLabel>
                {[1, 2].map((i) => (
                    <div key={i} className="border border-main rounded p-3 flex flex-col gap-2" style={{ borderStyle: "dashed" }}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                            <div className="h-3 w-24 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <WireBox label="Block" height="h-10" />
                            <WireBox label="Block" height="h-10" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const WireframeAnchorSectionBlock = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden" style={{ borderStyle: "dashed" }}>
        <div id="section-anchor" className="p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-main" style={{ borderStyle: "dashed" }}>
                <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--surface-3)" }}>
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "var(--accent)" }} />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <WireLabel>id="section-id"</WireLabel>
                        <div className="h-3 w-28 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                    </div>
                    <div className="h-2 w-40 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                </div>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                    <WireLabel>cols=4</WireLabel>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <WireBox label="colSpan=1" height="h-12" />
                    <WireBox label="colSpan=1" height="h-12" />
                    <div className="col-span-2">
                        <WireBox label="colSpan=2" height="h-12" />
                    </div>
                    <div className="col-span-4">
                        <WireBox label="colSpan=4" height="h-10" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);




const CODE_ANCHOR_LAYOUT = `
"use client";

import { AnchorLayoutLib } from "@/app/(ui)/component-library/template/anchor-section/anchor-layout-lib";
import { STATISTICS_SECTIONS } from "./sections.config";

export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AnchorLayoutLib
            title="Statistiques parlementaires"
            subtitle="Découvrez les données clés..."
            sections={STATISTICS_SECTIONS}
        >
            {children}
        </AnchorLayoutLib>
    );
}`;

const CODE_ANCHOR_SECTION_BLOCK = `
<AnchorSectionBlock
    id="demographie"
    title="Profil démographique"
    description="Âge, genre, représentation régionale."
    icon={Users}
    cols={4}
>
    {/* blocks ici */}
</AnchorSectionBlock>`;

//Section export
export const getAnchorSectionLibSections = () => [
    {
        title: "AnchorLayoutLib — Structure globale",
        description: "Layout générique avec header pleine largeur, navigation ancre sticky à gauche et zone de contenu principale.",
        code: CODE_ANCHOR_LAYOUT,
        component: <WireframeAnchorLayout />,
    },
    {
        title: "AnchorSectionBlockLib — Bloc de section",
        description: "Wrapper de section avec ancre HTML, header icône + titre + description, et grille responsive à N colonnes.",
        code: CODE_ANCHOR_SECTION_BLOCK,
        component: <WireframeAnchorSectionBlock />,
    },
];