"use client";

import React from "react";
import {WireLabel} from "@/app/(ui)/component-library/template/debug/wireframe/wire-frame.utils";

//Wireframes
const WireframeParagraphBlock = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden p-4 flex flex-col gap-3" style={{ borderStyle: "dashed" }}>
        <WireLabel>type="paragraph"</WireLabel>

        {/* highlight */}
        <div className="px-3 py-2 rounded border-l-2 flex items-center gap-2" style={{ borderColor: "var(--accent)", backgroundColor: "var(--surface-3)" }}>
            <WireLabel>highlight</WireLabel>
            <div className="flex flex-col gap-1 flex-1">
                <div className="h-2 w-full rounded" style={{ backgroundColor: "var(--surface-2)" }} />
                <div className="h-2 w-3/4 rounded" style={{ backgroundColor: "var(--surface-2)" }} />
            </div>
        </div>

        {/* text */}
        <div className="flex items-start gap-2">
            <WireLabel>text</WireLabel>
            <div className="flex flex-col gap-1 flex-1">
                <div className="h-2 w-full rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                <div className="h-2 w-5/6 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
            </div>
        </div>

        {/* list */}
        <div className="flex items-start gap-2">
            <WireLabel>list</WireLabel>
            <div className="flex flex-col gap-1.5 flex-1">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                        <div className="h-2 rounded flex-1" style={{ backgroundColor: "var(--surface-3)", width: `${70 + i * 7}%` }} />
                    </div>
                ))}
            </div>
        </div>

        {/* kpi */}
        <div className="flex items-start gap-2">
            <WireLabel>kpi</WireLabel>
            <div className="flex flex-col gap-1.5 w-full">
                {["Âge moyen", "Part de femmes", "Primo-députés"].map((label, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-main" style={{ borderStyle: "dashed" }}>
                        <div className="h-2 w-24 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-14 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--accent)", opacity: 0.5 }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const WireframeTableBlock = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden p-4 flex flex-col gap-3" style={{ borderStyle: "dashed" }}>
        <WireLabel>type="table"</WireLabel>

        {/* FilterBar */}
        <div className="flex items-center gap-2 p-2 rounded border border-main" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
            <WireLabel>FilterBarLib</WireLabel>
            <div className="h-7 w-32 rounded border border-main" style={{ backgroundColor: "var(--surface-3)" }} />
            <div className="h-7 w-24 rounded border border-main" style={{ backgroundColor: "var(--surface-3)" }} />
            <div className="ml-auto h-7 w-20 rounded" style={{ backgroundColor: "var(--accent)", opacity: 0.3 }} />
        </div>

        {/* Export */}
        <div className="flex items-center justify-between p-2 rounded border border-main" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
            <WireLabel>TableExportActions</WireLabel>
            <div className="flex gap-2">
                <div className="h-6 w-16 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                <div className="h-6 w-16 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
            </div>
        </div>

        {/* Table */}
        <div className="border border-main rounded overflow-hidden" style={{ borderStyle: "dashed" }}>
            <div className="grid grid-cols-4 border-b border-main" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
                {["Col A", "Col B", "Col C", "Col D"].map((h) => (
                    <div key={h} className="px-3 py-2 text-xs font-mono" style={{ color: "var(--subtitle-accent)" }}>{h}</div>
                ))}
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-4 border-b border-main" style={{ borderStyle: "dashed" }}>
                    {[0, 1, 2, 3].map((j) => (
                        <div key={j} className="px-3 py-2">
                            <div className="h-2 rounded" style={{ backgroundColor: "var(--surface-3)", width: `${50 + j * 10}%` }} />
                        </div>
                    ))}
                </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-2 rounded border border-main" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
            <WireLabel>TablePaginationLib</WireLabel>
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                <div className="h-4 w-16 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                <div className="h-7 w-7 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
            </div>
        </div>
    </div>
);

const WireframeChartBlock = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden p-4 flex flex-col gap-3" style={{ borderStyle: "dashed" }}>
        <WireLabel>type="chart"</WireLabel>

        <div className="grid grid-cols-3 gap-3">
            {/* bar */}
            <div className="border border-main rounded p-2 flex flex-col gap-2" style={{ borderStyle: "dashed" }}>
                <WireLabel>type="bar"</WireLabel>
                <div className="h-20 rounded flex items-end gap-1 px-2 pb-1" style={{ backgroundColor: "var(--surface-3)" }}>
                    {[4, 7, 5, 9, 6, 8, 3].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 9}%`, backgroundColor: "var(--accent)", opacity: 0.7 }} />
                    ))}
                </div>
            </div>

            {/* line */}
            <div className="border border-main rounded p-2 flex flex-col gap-2" style={{ borderStyle: "dashed" }}>
                <WireLabel>type="line"</WireLabel>
                <div className="h-20 rounded relative overflow-hidden" style={{ backgroundColor: "var(--surface-3)" }}>
                    <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <polyline
                            points="0,40 15,30 30,35 45,15 60,20 75,10 100,18"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="2"
                            opacity="0.7"
                        />
                    </svg>
                </div>
            </div>

            {/* donut */}
            <div className="border border-main rounded p-2 flex flex-col gap-2" style={{ borderStyle: "dashed" }}>
                <WireLabel>type="donut"</WireLabel>
                <div className="h-20 rounded flex items-center justify-center" style={{ backgroundColor: "var(--surface-3)" }}>
                    <svg viewBox="0 0 40 40" className="w-14 h-14">
                        <circle cx="20" cy="20" r="15" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray="60 35" opacity="0.8" />
                        <circle cx="20" cy="20" r="15" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray="25 70" strokeDashoffset="-60" opacity="0.4" />
                        <circle cx="20" cy="20" r="9" fill="var(--surface-2)" />
                    </svg>
                </div>
            </div>

            {/* stacked-bar colSpan=3 */}
            <div className="col-span-3 border border-main rounded p-2 flex flex-col gap-2" style={{ borderStyle: "dashed" }}>
                <WireLabel>type="stacked-bar"</WireLabel>
                <div className="h-16 rounded flex items-end gap-1 px-2 pb-1" style={{ backgroundColor: "var(--surface-3)" }}>
                    {[
                        [5, 3, 2],
                        [4, 4, 3],
                        [6, 2, 4],
                        [3, 5, 2],
                        [7, 2, 1],
                    ].map((stack, i) => (
                        <div key={i} className="flex-1 flex flex-col-reverse gap-0 rounded-sm overflow-hidden" style={{ height: `${(stack[0] + stack[1] + stack[2]) * 8}%` }}>
                            {stack.map((h, j) => (
                                <div key={j} className="w-full" style={{ flex: h, backgroundColor: "var(--accent)", opacity: 0.3 + j * 0.25 }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const WireframeBlockSectionRenderer = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden p-4 flex flex-col gap-3" style={{ borderStyle: "dashed" }}>
        <WireLabel>BlockSectionRenderer</WireLabel>

        <div className="grid grid-cols-4 gap-2">
            {/* stat colSpan=1 */}
            <div className="col-span-1 border border-main rounded p-2 flex flex-col gap-1.5" style={{ borderStyle: "dashed" }}>
                <WireLabel>stat - colSpan=1</WireLabel>
                <div className="h-16 rounded flex items-end gap-0.5 px-1 pb-1" style={{ backgroundColor: "var(--surface-3)" }}>
                    {[4, 7, 5, 9, 6, 8, 3].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 8}%`, backgroundColor: "var(--accent)", opacity: 0.6 }} />
                    ))}
                </div>
            </div>

            {/* paragraph colSpan=1 */}
            <div className="col-span-1 border border-main rounded p-2 flex flex-col gap-1.5" style={{ borderStyle: "dashed" }}>
                <WireLabel>paragraph - colSpan=1</WireLabel>
                <div className="px-2 py-1.5 rounded border-l-2" style={{ borderColor: "var(--accent)", backgroundColor: "var(--surface-3)" }}>
                    <div className="h-1.5 w-full rounded mb-1" style={{ backgroundColor: "var(--surface-2)" }} />
                    <div className="h-1.5 w-3/4 rounded" style={{ backgroundColor: "var(--surface-2)" }} />
                </div>
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-main" style={{ borderStyle: "dashed" }}>
                        <div className="h-1.5 w-12 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                        <div className="h-1.5 w-8 rounded" style={{ backgroundColor: "var(--surface-3)" }} />
                    </div>
                ))}
            </div>

            {/* table colSpan=2 */}
            <div className="col-span-2 border border-main rounded p-2 flex flex-col gap-1.5" style={{ borderStyle: "dashed" }}>
                <WireLabel>table — colSpan=2</WireLabel>
                <div className="border border-main rounded overflow-hidden" style={{ borderStyle: "dashed" }}>
                    <div className="grid grid-cols-3 border-b border-main py-1.5" style={{ backgroundColor: "var(--surface-2)" }}>
                        {["Col A", "Col B", "Col C"].map((h) => (
                            <div key={h} className="px-2 text-xs" style={{ color: "var(--subtitle-accent)", fontSize: "10px" }}>{h}</div>
                        ))}
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-3 border-b border-main py-1" style={{ borderStyle: "dashed" }}>
                            {[0, 1, 2].map((j) => (
                                <div key={j} className="px-2">
                                    <div className="h-1.5 rounded" style={{ backgroundColor: "var(--surface-3)", width: "70%" }} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* stat colSpan=4 */}
            <div className="col-span-4 border border-main rounded p-2 flex flex-col gap-1.5" style={{ borderStyle: "dashed" }}>
                <WireLabel>stat — colSpan=4</WireLabel>
                <div className="h-10 rounded flex items-end gap-1 px-2 pb-1" style={{ backgroundColor: "var(--surface-3)" }}>
                    {[5, 8, 4, 9, 6, 7, 3, 8, 5, 9, 4, 7].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 8}%`, backgroundColor: "var(--accent)", opacity: 0.5 }} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

//Code snippets
const CODE_PARAGRAPH_BLOCK = `// Dans sections.config.ts
{
    type: "paragraph",
    colSpan: 2,
    items: [
        { type: "highlight", content: "L'Assemblée nationale..." },
        { type: "text",      content: "Les députés sont très diplômés..." },
        { type: "list",      items: ["Sciences Po...", "La part des grandes écoles..."] },
        { type: "kpi",       label: "Âge moyen", value: "49,3 ans", trend: "down", trendLabel: "−1,4 ans" },
    ],
}`;

const CODE_TABLE_BLOCK = `// Dans sections.config.ts
{
    type: "table" as const,
    colSpan: 2,
    ...table("professions-deputes"), // depuis TABLE_REGISTRY
}

// Ou inline
{
    type: "table" as const,
    colSpan: 2,
    id: "professions-deputes",
    title: "Professions déclarées",
    gatewayFn: async (legislature) => [...],
    columns: [
        { id: "nom", header: "Député", align: "left", cell: (r) => r.nom },
    ],
    getRowKey: (r) => r.id,
    pagination: { pageSize: 15 },
    filter: { sortOptions: [...], filterFields: [...], applyMode: "auto" },
    export: { filenameBase: "professions", csvColumns: [...] },
}`;

const CODE_BLOCK_SECTION_RENDERER = `// Tous les types de blocks dans une section
{
    id: "demographie",
    cols: 4,
    blocks: [
        { type: "paragraph", colSpan: 1, items: [...] },
        { type: "chart",      colSpan: 1, config: stat("age-distribution") },
        { type: "chart",      colSpan: 4, config: stat("age-evolution-groupe") },
        { type: "table",     colSpan: 2, ...table("professions-deputes") },
    ],
}`;

const CODE_CHART_BLOCK = `// Dans sections.config.ts
{ type: "chart", config: stat("age-distribution"),    colSpan: 1 },
{ type: "chart", config: stat("genre"),               colSpan: 1 },
{ type: "chart", config: stat("age-evolution-groupe"),colSpan: 4 },

// Dans stats.registry.ts
{
    id: "age-distribution",
    title: "Répartition par tranche d'âge",
    theme: "demographie",
    gatewayFn: async (legislature) => ({
        type: "bar",
        data: [{ label: "18-30", value: 12 }, ...],
    }),
}`;


//Sections export
export const getBlockSectionLibSections = () => [
    {
        title: "BlockParagraphRenderer — Block texte enrichi",
        description: "Rendu déclaratif de contenu textuel : highlight, texte libre, liste à puces, et KPIs avec tendance.",
        code: CODE_PARAGRAPH_BLOCK,
        component: <WireframeParagraphBlock />,
    },
    {
        title: "BlockTableRenderer — Block tableau complet",
        description: "Tableau avec FilterBar, export CSV/JSON et pagination locale. Chaque fonctionnalité est activée via la config.",
        code: CODE_TABLE_BLOCK,
        component: <WireframeTableBlock />,
    },
    {
        title: "BlockChartRenderer — Block graphique",
        description: "Rendu d'un StatConfig depuis le registry. Supporte bar, line, donut, stacked-bar, scatter et leurs variantes multi-séries.",
        code: CODE_CHART_BLOCK,
        component: <WireframeChartBlock />,
    },
    {
        title: "BlockSectionRenderer — Dispatcher de blocks",
        description: "Dispatche vers le bon composant selon block.type. Gère le colSpan dans la grille de la section parente.",
        code: CODE_BLOCK_SECTION_RENDERER,
        component: <WireframeBlockSectionRenderer />,
    },
];