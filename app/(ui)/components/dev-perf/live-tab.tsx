"use client";

import React, { useMemo } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { SelectLib, SelectOption } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { BarChartLib, BarChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { LineChartLib, LineChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/line-chart/line-chart-lib";
import { ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";
import { DISTRIBUTION_PERCENTILES, distributionChartRows, liveData } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { card, formatAvgP95, Ms, SectionTitle, td, tdNum, th, thNum } from "@/app/(ui)/components/dev-perf/dev-perf-ui";

export const ALL_REQUESTS = "*";

export const LIVE_WINDOWS: { label: string; ms: number | null }[] = [
    { label: "1 min", ms: 60_000 },
    { label: "5 min", ms: 300_000 },
    { label: "Tout", ms: null },
];

/** Trois durées du même appel, du plus englobant au plus précis, puis la tendance. */
const LIVE_SERIES: LineChartSeriesConfig[] = [
    { dataKey: "navigateur", label: "Navigateur" },
    { dataKey: "serveur", label: "Serveur" },
    { dataKey: "base", label: "Base de données" },
    { dataKey: "tendance", label: "Tendance navigateur (10 appels)" },
];

const DISTRIBUTION_SERIES: BarChartSeriesConfig[] = [
    { dataKey: "navigateur", label: "Navigateur" },
    { dataKey: "serveur", label: "Serveur" },
    { dataKey: "base", label: "Base de données (hors cache)" },
];

const DISTRIBUTION_ROWS: { key: "browser" | "server" | "database"; label: string }[] = [
    { key: "browser", label: "Navigateur" },
    { key: "server", label: "Serveur" },
    { key: "database", label: "Base de données (hors cache)" },
];

type LiveTabProps = {
    client: ClientPerfRecord[];
    now: number;
    windowMs: number | null;
    onWindowChange: (ms: number | null) => void;
    family: string | null;
    onFamilyChange: (family: string | null) => void;
    familyOptions: SelectOption[];
};

/** Onglet « En direct » : appels au fil de l'eau, indicateurs et distribution sur la fenêtre choisie. */
export function LiveTab({ client, now, windowMs, onWindowChange, family, onFamilyChange, familyOptions }: LiveTabProps) {
    const live = useMemo(() => liveData(client, { now, windowMs, family }), [client, now, windowMs, family]);

    return (
        <section>
            <SectionTitle
                title="En direct"
                hint="Chaque point de l'axe horizontal est un appel d'API, dans l'ordre où il a eu lieu (heure · requête). Pour chaque appel : la durée vue du navigateur (ce qu'attend l'utilisateur), dont le temps passé sur le serveur, dont le temps passé dans la base de données. La ligne « Base de données » s'interrompt sur les appels servis par le cache. « Tendance » lisse le navigateur sur les 10 derniers appels."
            />
            <div className="mb-4 flex flex-wrap items-end gap-3">
                {LIVE_WINDOWS.map((w) => (
                    <ButtonLib
                        key={w.label}
                        text={w.label}
                        size="small"
                        variant={windowMs === w.ms ? "primary" : "tertiary"}
                        onClick={() => onWindowChange(w.ms)}
                    />
                ))}
                <div className="min-w-72">
                    <SelectLib
                        options={familyOptions}
                        value={family ?? ALL_REQUESTS}
                        onChange={(v) => onFamilyChange(v === ALL_REQUESTS ? null : v)}
                    />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                <KpiCardLib kpiValue={live.stats.calls} kpiLabel="appels" />
                <KpiCardLib kpiValue={formatAvgP95(live.stats.browser)} kpiLabel="navigateur (moy. / p95)" />
                <KpiCardLib kpiValue={formatAvgP95(live.stats.server)} kpiLabel="serveur (moy. / p95)" />
                <KpiCardLib kpiValue={formatAvgP95(live.stats.database)} kpiLabel="base de données, hors cache (moy. / p95)" />
                <KpiCardLib kpiValue={`${Math.round(live.stats.cacheRate * 100)} %`} kpiLabel="servis par le cache" />
            </div>

            <div className={`${card} mb-4`}>
                <LineChartLib
                    subtitle={`${family ? `Requête suivie : ${family}` : "Toutes les requêtes"} · ${live.rows.length} derniers appels · durées en ms`}
                    data={live.rows}
                    series={LIVE_SERIES}
                    height={340}
                    emptyLabel="Aucun appel sur cette fenêtre : navigue sur le site dans un autre onglet"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className={`${card} overflow-x-auto`}>
                    <h3 className="mb-1 font-semibold">Distribution des durées</h3>
                    <p className="mb-3 text-sm text-subtitle-accent">
                        p50 = médiane ; p90 : 90 % des appels sont plus rapides. Un p95 loin du p50 signale des appels lents isolés.
                    </p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className={th}>Durée</th>
                                {DISTRIBUTION_PERCENTILES.map((p) => <th key={p} className={thNum}>p{p}</th>)}
                                <th className={thNum}>Appels</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DISTRIBUTION_ROWS.map(({ key, label }) => {
                                const profile = live.distribution[key];
                                return (
                                    <tr key={key}>
                                        <td className={td}>{label}</td>
                                        {DISTRIBUTION_PERCENTILES.map((p) => (
                                            <td key={p} className={tdNum}>{profile.count ? <Ms ms={profile.values[p]} /> : "—"}</td>
                                        ))}
                                        <td className={tdNum}>{profile.count}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={card}>
                    <BarChartLib
                        subtitle="Distribution par percentile (ms)"
                        data={distributionChartRows(live.distribution)}
                        series={DISTRIBUTION_SERIES}
                        height={240}
                    />
                </div>
            </div>
        </section>
    );
}
