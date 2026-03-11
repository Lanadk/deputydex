"use client";

import React from "react";
import {BlockChartRenderer} from "@/app/(ui)/component-library/template/block-section/_renderers/block-chart-renderer";
import {BlockParagraphRenderer} from "@/app/(ui)/component-library/template/block-section/_renderers/block-paragraph-renderer";
import {BlockTableRenderer} from "@/app/(ui)/component-library/template/block-section/_renderers/block-table-renderer";
import {ChartConfig} from "@/app/(ui)/component-library/template/block-section/chart-config.types";
import {TableConfig} from "@/app/(ui)/component-library/template/block-section/table-config.types";

export type ColSpan = 1 | 2 | 3 | 4;
export type ParagraphItem =
    | { type: "text"; content: string }
    | { type: "highlight"; content: string }
    | { type: "list"; items: string[] }
    | { type: "kpi"; label: string; value: string; trend?: "up" | "down" | "neutral"; trendLabel?: string }

//Blocks

export type SectionBlock<TRow = unknown> =
    | {
    type: "chart";
    /** Occupe 2 colonnes dans la grille (défaut: 1) */
    colSpan?: ColSpan;
    config: ChartConfig;
}
    | {
    type: "paragraph";
    colSpan?: ColSpan;
    items: ParagraphItem[];
}
    | {
    type: "table";
    colSpan?: ColSpan;
} & TableConfig<TRow>

interface BlockSectionRendererProps {
    block: SectionBlock;
    legislature: number;
}

/**
 * BlockSectionRenderer
 * Dispatche vers le bon composant selon block.type.
 * Applique le colSpan sur le wrapper grid item.
 */
export const BlockSectionRenderer: React.FC<BlockSectionRendererProps> = ({
                                                                              block,
                                                                              legislature,
                                                                          }) => {
    const colSpanClass =
        block.colSpan === 2 ? "md:col-span-2" :
            block.colSpan === 3 ? "md:col-span-3" :
                block.colSpan === 4 ? "md:col-span-4" :
                    "";

    const rendered = (() => {
        switch (block.type) {
            case "chart":
                return (
                    <BlockChartRenderer
                        config={block.config}
                        legislature={legislature}
                    />
                );

            case "paragraph":
                return <BlockParagraphRenderer items={block.items}/>;

            case "table":
                return (
                    <BlockTableRenderer
                        config={block}
                        legislature={legislature}
                    />
                );
        }
    })();

    return (
        <div className={colSpanClass}>
            {rendered}
        </div>
    );
};