"use client";

import React from "react";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { ChartDisplayType } from "@/app/(ui)/_shared/statistics/comparator/comparator.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { useStatData } from "@/app/(ui)/_shared/statistics/data/use-stat-data";
import { useStatInsight } from "@/app/(ui)/_shared/statistics/insights/use-stat-insight";
import { isContextReady } from "@/app/(ui)/_shared/statistics/context/is-context-ready";
import { buildContextLabel } from "@/app/(ui)/_shared/statistics/context/build-context-label";
import {
    DISPLAY_TYPE_COMPATIBILITY,
    DISPLAY_TYPE_LABELS,
} from "@/app/(ui)/_shared/statistics/data/display-type-compatibility";
import { RenderStatChart } from "@/app/(ui)/components/statistics/render-stat-chart";
import { toExportRows } from "@/app/(ui)/_shared/statistics/data/export-stat-data";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { TableExportActions } from "@/app/(ui)/component-library/molecules/table/components/table-export-actions";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { exportRows } from "@/app/(ui)/utils/export-rows";
import { ExportFormat } from "@/app/_shared/export/export.types";

interface StatViewerProps {
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
export const StatViewer: React.FC<StatViewerProps> = ({
                                                            definition,
                                                            context,
                                                            displayType,
                                                            onDisplayTypeChange,
                                                        }) => {
    const { data, loading, error, retry } = useStatData(definition, context);
    const insight = useStatInsight(definition, context, data);
    const ready = isContextReady(definition.domain, definition.scope, context);

    const compatibleDisplayTypes = DISPLAY_TYPE_COMPATIBILITY[definition.dataShape];
    const resolvedDisplayType = displayType ?? compatibleDisplayTypes[0] ?? null;

    // "Tous les groupes — 17ᵉ législature", "RN — 17ᵉ législature",
    // "Amélie Durand"... — vide si le domaine n'a ni entité ni législature à
    // afficher (ex: votes/scrutins, qui n'ont pas encore d'EntityResolver).
    // Répété sur CHAQUE StatViewer (pas juste l'en-tête de colonne en
    // comparaison) : sans ça, un graphe seul ne dit jamais sur quelle
    // population il porte.
    const contextLabel = buildContextLabel(definition.domain, context, "");
    const chartTitle = contextLabel ? `${definition.title} — ${contextLabel}` : definition.title;

    // Code du groupe sélectionné, pour un chart à une seule série coloré
    // "parliament-group" (ex: groupes.cohesion) — voir RenderStatChart.groupLabel.
    // `entityLabel` est posé au code du groupe (pas son libellé complet) par
    // GroupeEntityResolver au moment du choix, exactement ce dont
    // getCanonicalGroupChartColor a besoin.
    const groupChartLabel =
        definition.domain === "groupes"
            ? ((context.filters?.entityLabel as string | undefined) ?? context.entityId ?? null)
            : null;

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
                    {contextLabel && (
                        <SpanLib className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-accent">
                            {contextLabel}
                        </SpanLib>
                    )}
                    {definition.description && (
                        <SpanLib className="mt-1 block text-sm leading-relaxed text-subtitle-accent">
                            {definition.description}
                        </SpanLib>
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

            {insight && (
                <p className="rounded-lg border-l-2 px-3 py-2 text-sm" style={{ borderColor: "var(--accent)", backgroundColor: "var(--surface-2)" }}>
                    {insight}
                </p>
            )}

            {!ready ? (
                <div className="flex items-center justify-center rounded-lg border border-dashed border-main bg-surface-2 p-8 text-center">
                    <SpanLib className="text-subtitle-accent">
                        Complète les filtres ci-dessus (législature, entité...) pour afficher ce graphe.
                    </SpanLib>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-main bg-surface-2 p-8 text-center">
                    <SpanLib className="text-subtitle-accent">
                        Impossible de charger cette statistique pour le moment.
                    </SpanLib>
                    <ButtonLib text="Réessayer" size="small" variant="tertiary" onClick={retry} />
                </div>
            ) : (
                <RenderStatChart
                    data={data}
                    displayType={resolvedDisplayType}
                    loading={loading}
                    title={chartTitle}
                    variant={definition.chartVariant}
                    groupLabel={groupChartLabel}
                />
            )}

            <TableExportActions exportEnabled={!!data} onExportAction={handleExport} />

            <details className="text-sm">
                <summary className="cursor-pointer text-subtitle-accent">Comment c&apos;est calculé ?</summary>
                <p className="mt-2 text-subtitle-accent">{definition.methodology}</p>
            </details>
        </div>
    );
};
