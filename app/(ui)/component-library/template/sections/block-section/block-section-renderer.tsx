"use client";

import React from "react";
import {BlockChartRenderer} from "@/app/(ui)/component-library/template/sections/block-section/_renderers/block-chart-renderer";
import {
    BlockParagraphRenderer
} from "@/app/(ui)/component-library/template/sections/block-section/_renderers/block-paragraph-renderer";
import {BlockTableRenderer} from "@/app/(ui)/component-library/template/sections/block-section/_renderers/block-table-renderer";
import {ChartConfig, ChartDataWrapper} from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import {TableConfig} from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import {CardConfig, CardDataWrapper} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import {BlockCardRenderer} from "@/app/(ui)/component-library/template/sections/block-section/_renderers/block-card-renderer";
import {
    ActivityCalendarConfig, ActivityCalendarDataWrapper
} from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import {
    BlockActivityCalendarRenderer
} from "@/app/(ui)/component-library/template/sections/block-section/_renderers/block-activity-calendar-renderer";
import {
    SectionActions
} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

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
} | {
    type: "paragraph";
    colSpan?: ColSpan;
    items: ParagraphItem[];
} | {
    type: "card"
    colSpan?: ColSpan;
    config: CardConfig;
} | {
    type: "activity-calendar";
    colSpan?: ColSpan;
    config: ActivityCalendarConfig;
    actions?: any;
} | {
    type: "table";
    colSpan?: ColSpan;
} & TableConfig<TRow>

export type BlockDataWrapper =
    | ChartDataWrapper
    | CardDataWrapper
    | ActivityCalendarDataWrapper
    | unknown[]; // table rows

type BlockSectionRendererProps = {
    block: SectionBlock;
    dataMap: Record<string, BlockDataWrapper>;
    loading: boolean;
    params: Record<string, unknown>;
    actions?: SectionActions;
};

/**
 * BlockSectionRenderer
 * Dispatche vers le bon composant selon block.type.
 * Applique le colSpan sur le wrapper grid item.
 */
export const BlockSectionRenderer: React.FC<BlockSectionRendererProps> = ({
                                                                              block,
                                                                              dataMap,
                                                                              loading,
                                                                              params,
                                                                              actions
                                                                          }) => {
    const colSpanClass =
        block.colSpan === 2 ? "sm:col-span-2" :
            block.colSpan === 3 ? "sm:col-span-2 xl:col-span-3" :
                block.colSpan === 4 ? "sm:col-span-2 xl:col-span-4" :
                    "";

    const rendered = (() => {
        switch (block.type) {
            case "chart":
                return (
                    <BlockChartRenderer
                        config={block.config}
                        data={dataMap[block.config.id] as ChartDataWrapper ?? null}
                        loading={loading}
                    />
                );

            case "paragraph":
                return <BlockParagraphRenderer items={block.items}/>;

            case "table":
                return (
                    <BlockTableRenderer
                        config={block}
                        data={dataMap[block.id] as unknown[] ?? []}
                        loading={loading}
                    />
                );

            case "card":
                return (
                    <BlockCardRenderer
                        config={block.config}
                        data={dataMap[block.config.id] as CardDataWrapper ?? null}
                        loading={loading}
                    />
                );

            case "activity-calendar":
                return (
                    <BlockActivityCalendarRenderer
                        config={block.config}
                        data={dataMap[block.config.id] as ActivityCalendarDataWrapper ?? null}
                        loading={loading}
                        params={params}
                        actions={actions}
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