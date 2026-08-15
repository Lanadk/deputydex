"use client";

import React from "react";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { ChartDisplayType } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { useStatData } from "@/app/(ui)/(views)/(db)/statistics/_catalog/use-stat-data";
import {
    DISPLAY_TYPE_COMPATIBILITY,
    DISPLAY_TYPE_LABELS,
} from "@/app/(ui)/(views)/(db)/statistics/_catalog/display-type-compatibility";
import { RenderStatChart } from "@/app/(ui)/(views)/(db)/statistics/_catalog/render-stat-chart";
import { toExportRows } from "@/app/(ui)/(views)/(db)/statistics/_catalog/export-stat-data";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { TableExportActions } from "@/app/(ui)/component-library/molecules/table/components/table-export-actions";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { exportRows } from "@/app/(ui)/utils/export-rows";
import { ExportFormat } from "@/app/_shared/export/export.types";

interface StatViewerLibProps {
    definition: StatDefinition;
    context: StatFetchParams;
    /** displayTypes[contextIndex][definitionId] côté appelant — null = pas encore choisi */
    displayType: ChartDisplayType | null;
    onDisplayTypeChange: (displayType: ChartDisplayType) => void;
}

/**
 * Rend UNE stat pour UN contexte : fetch (useStatData), chart (via
 * RenderStatChart), format-switcher, export CSV/JSON, méthodologie à la
 * demande. C'est l'unité atomique du hub Statistiques — la page l'instancie
 * une fois par (stat sélectionnée × contexte), qu'on soit en mode
 * exploration (1 contexte) ou comparateur (2 contextes) : aucune divergence
 * de props entre les deux, voir comparator.types.ts.
 */
export const StatViewerLib: React.FC<StatViewerLibProps> = ({
                                                                  definition,
                                                                  context,
                                                                  displayType,
                                                                  onDisplayTypeChange,
                                                              }) => {
    const { data, loading } = useStatData(definition, context);

    const compatibleDisplayTypes = DISPLAY_TYPE_COMPATIBILITY[definition.dataShape];
    const resolvedDisplayType = displayType ?? compatibleDisplayTypes[0] ?? null;

    const handleExport = (format: ExportFormat) => {
        if (!data) return;
        const { rows, csvColumns } = toExportRows(data);
        exportRows(rows, format, { filenameBase: definition.slug, csvColumns });
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-main bg-surface-1 p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold">{definition.title}</h3>
                    {definition.description && (
                        <SpanLib className="text-subtitle-accent">{definition.description}</SpanLib>
                    )}
                </div>

                {compatibleDisplayTypes.length > 1 && (
                    <div className="w-44 shrink-0">
                        <SelectLib
                            options={compatibleDisplayTypes.map((dt) => ({ value: dt, label: DISPLAY_TYPE_LABELS[dt] }))}
                            value={resolvedDisplayType ?? ""}
                            onChange={(value) => onDisplayTypeChange(value as ChartDisplayType)}
                        />
                    </div>
                )}
            </div>

            <RenderStatChart data={data} displayType={resolvedDisplayType} loading={loading} title={definition.title} />

            <TableExportActions exportEnabled={!!data} onExportAction={handleExport} />

            <details className="text-sm">
                <summary className="cursor-pointer text-subtitle-accent">Comment c&apos;est calculé ?</summary>
                <p className="mt-2 text-subtitle-accent">{definition.methodology}</p>
            </details>
        </div>
    );
};
