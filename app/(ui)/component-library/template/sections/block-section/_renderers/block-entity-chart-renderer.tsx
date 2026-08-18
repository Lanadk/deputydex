"use client";

import React, { useMemo, useState } from "react";
import { EntityChartConfig, EntityChartDataWrapper } from "@/app/(ui)/component-library/template/sections/block-section/entity-chart-config.types";
import { STATS_CATALOG } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { useStatData } from "@/app/(ui)/_shared/statistics/data/use-stat-data";
import { RenderStatChart } from "@/app/(ui)/components/statistics/render-stat-chart";
import { getCanonicalGroupTheme, isParliamentGroupVariant } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

/** Utilisée uniquement si `statDomain`/`statSlug` ne correspond à aucune stat enregistrée (erreur de config, ne devrait jamais arriver en prod) — évite d'appeler `useStatData` avec `undefined` (violerait les règles des hooks / crasherait dans `isContextReady`). */
const FALLBACK_DEFINITION: StatDefinition = {
    id: "",
    slug: "",
    domain: "groupes",
    scope: "aggregate",
    title: "",
    category: "",
    keywords: [],
    methodology: "",
    dataShape: "multi-series",
};

type BlockEntityChartRendererProps = {
    config: EntityChartConfig;
    data: EntityChartDataWrapper | null;
    /** Législature en cours côté section — sert de `filters.legislature` pour le fetch. */
    legislature: number | undefined;
};

/**
 * Chart multi-séries + boutons de sélection à la volée — un seul fetch (la
 * stat `config.statSlug`, scope aggregate, dataShape multi-series : une
 * série par entité) via `useStatData`, puis filtrage côté client sur
 * `data.series` selon les entités désactivées. Toutes les entités sont
 * affichées par défaut ; cliquer un bouton retire/remet SA courbe, sans
 * jamais retaper le réseau. La liste de boutons vient du `gatewayFn` de la
 * section (`data.entities`) — un bouton par entité, coloré avec le thème du
 * groupe quand `variant === "parliament-group"` (même palette que
 * `GroupCell`/les charts "parliament-group"), sinon un style neutre.
 */
export const BlockEntityChartRenderer: React.FC<BlockEntityChartRendererProps> = ({ config, data, legislature }) => {
    const [hiddenCodes, setHiddenCodes] = useState<Set<string>>(new Set());

    const definition = STATS_CATALOG
        .flatMap((module) => module.stats)
        .find((stat) => stat.domain === config.statDomain && stat.slug === config.statSlug);

    const { data: stat, loading } = useStatData(
        definition ?? FALLBACK_DEFINITION,
        { filters: { legislature } }
    );

    // Filtre côté client — jamais un nouveau fetch juste pour
    // afficher/masquer une courbe.
    const filteredStat = useMemo(() => {
        if (!stat || stat.shape !== "multi-series") return stat;
        return { ...stat, series: stat.series.filter((s) => !hiddenCodes.has(s.name)) };
    }, [stat, hiddenCodes]);

    if (!definition) {
        // Erreur de config (statDomain/statSlug ne correspond à aucune stat
        // enregistrée) — ne devrait jamais arriver en prod, seulement pendant
        // le développement d'un nouveau thème.
        return null;
    }

    const entities = data?.entities ?? [];
    const colored = isParliamentGroupVariant(config.variant);

    const toggle = (code: string) => {
        setHiddenCodes((prev) => {
            const next = new Set(prev);
            if (next.has(code)) next.delete(code);
            else next.add(code);
            return next;
        });
    };

    return (
        <div className="flex flex-col gap-3">
            {config.entityLabel && <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--subtitle-accent)" }}>{config.entityLabel}</span>}

            <div className="flex flex-wrap gap-2">
                {entities.map((e) => {
                    const active = !hiddenCodes.has(e.code);
                    const theme = colored ? getCanonicalGroupTheme(e.code) : null;

                    return (
                        <button
                            key={e.code}
                            type="button"
                            onClick={() => toggle(e.code)}
                            aria-pressed={active}
                            className="rounded-full px-3 py-1 text-sm font-medium transition-opacity hover:opacity-90"
                            style={
                                theme
                                    ? {
                                        backgroundColor: theme.badgeBg,
                                        color: theme.badgeText,
                                        outline: active ? `2px solid ${theme.chart}` : "2px solid transparent",
                                        outlineOffset: 2,
                                        opacity: active ? 1 : 0.35,
                                    }
                                    : {
                                        backgroundColor: active ? "var(--btn-primary-bg)" : "var(--surface-3)",
                                        color: active ? "var(--btn-primary-text)" : "var(--foreground)",
                                        border: "1px solid var(--border-main)",
                                        opacity: active ? 1 : 0.5,
                                    }
                            }
                        >
                            {e.label}
                        </button>
                    );
                })}
            </div>

            <RenderStatChart
                data={filteredStat ?? null}
                displayType={config.displayType}
                loading={loading}
                title={config.title}
                variant={config.variant}
            />
        </div>
    );
};
