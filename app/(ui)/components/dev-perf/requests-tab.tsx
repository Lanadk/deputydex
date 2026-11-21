"use client";

import React from "react";
import { BarChartLib, BarChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import {
    cacheSpeedup,
    DomainSummary,
    domainChartRows,
    hasManySqlQueries,
    HEAVY_RESPONSE_BYTES,
    MANY_SQL_THRESHOLD,
    RequestSummary,
} from "@/app/_shared/dev-perf/dev-perf.aggregate";
import {
    AvgP95,
    card,
    formatBytes,
    formatSpeedup,
    Ms,
    SectionTitle,
    td,
    tdNum,
    th,
    thNum,
} from "@/app/(ui)/components/dev-perf/dev-perf-ui";

/** SQL + hors SQL empilés = serveur sans cache. */
const DOMAIN_CHART_SERIES: BarChartSeriesConfig[] = [
    { dataKey: "sql", label: "Base de données (SQL)", stack: "serveur" },
    { dataKey: "horsSql", label: "Serveur hors SQL", stack: "serveur" },
    { dataKey: "reseau", label: "Navigateur (réseau + serveur)" },
];

const isHeavy = (r: RequestSummary) => r.bytes.avg >= HEAVY_RESPONSE_BYTES;

/** Pastille d'alerte dans le tableau des requêtes. */
function Flag({ label, title }: { label: string; title: string }) {
    return (
        <span
            className="ml-2 rounded px-1.5 py-0.5 text-xs font-sans"
            style={{ color: "var(--ui-warning)", border: "1px solid var(--ui-warning)" }}
            title={title}
        >
            {label}
        </span>
    );
}

type RequestsTabProps = {
    domains: DomainSummary[];
    selectedFamily: string | null;
    onSelectFamily: (family: string | null) => void;
};

/** Onglet « Requêtes API » : coût de chaque requête, avec et sans cache, poids, alertes. */
export function RequestsTab({ domains, selectedFamily, onSelectFamily }: RequestsTabProps) {
    const all = domains.flatMap((d) => d.requests);
    const manySql = all.filter(hasManySqlQueries);
    const heavy = all.filter(isHeavy);

    if (domains.length === 0) {
        return <p className="text-sm text-subtitle-accent">Aucun appel mesuré : navigue sur le site dans un autre onglet.</p>;
    }

    return (
        <section className="flex flex-col gap-4">
            <SectionTitle
                title="Requêtes API"
                hint="Toutes les mesures regroupées par requête et par domaine, appels sans cache (use-case et SQL exécutés) et avec cache séparés. « moy. / p95 ». Clique une requête pour la suivre dans l'onglet « En direct »."
            />

            {(manySql.length > 0 || heavy.length > 0) && (
                <div className={card}>
                    <h3 className="mb-2 font-semibold">Points d&apos;attention</h3>
                    <ul className="flex flex-col gap-1 text-sm">
                        {manySql.map((r) => (
                            <li key={`sql-${r.family}`}>
                                <span className="font-mono">{r.family}</span> lance {r.withoutCache.avgSqlCount.toFixed(0)} requêtes SQL par appel
                                {" "}(seuil : {MANY_SQL_THRESHOLD}) : à regrouper en une requête ou une vue d&apos;agrégation ?
                            </li>
                        ))}
                        {heavy.map((r) => (
                            <li key={`bytes-${r.family}`}>
                                <span className="font-mono">{r.family}</span> renvoie {formatBytes(r.bytes.avg)} en moyenne
                                {" "}(seuil : {formatBytes(HEAVY_RESPONSE_BYTES)}) : pagination ou champs inutiles ?
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={card}>
                <BarChartLib
                    subtitle="Durée moyenne d'un appel par domaine (ms) : serveur sans cache (base de données + reste) et navigateur"
                    data={domainChartRows(domains)}
                    series={DOMAIN_CHART_SERIES}
                    height={260}
                />
            </div>

            <div className={`${card} overflow-x-auto`}>
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={th}>Requête</th>
                            <th className={thNum}>Appels (en cache)</th>
                            <th className={thNum}>Sans cache</th>
                            <th className={thNum}>dont base</th>
                            <th className={thNum}>Req. SQL</th>
                            <th className={thNum}>Avec cache</th>
                            <th className={thNum}>Accélération</th>
                            <th className={thNum}>Poids moy.</th>
                            <th className={thNum}>Navigateur</th>
                        </tr>
                    </thead>
                    {domains.map((d) => (
                        <tbody key={d.domain}>
                            <tr>
                                <td colSpan={9} className="pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-subtitle-accent">
                                    {d.domain}
                                </td>
                            </tr>
                            {d.requests.map((r) => (
                                <tr
                                    key={r.family}
                                    onClick={() => onSelectFamily(selectedFamily === r.family ? null : r.family)}
                                    className={`cursor-pointer hover:bg-surface-3 ${selectedFamily === r.family ? "bg-surface-3" : ""}`}
                                >
                                    <td className={`${td} font-mono whitespace-nowrap`}>
                                        {r.family}
                                        {hasManySqlQueries(r) && <Flag label="SQL ×" title="Beaucoup de requêtes SQL par appel" />}
                                        {isHeavy(r) && <Flag label="lourde" title="Réponse JSON volumineuse" />}
                                    </td>
                                    <td className={tdNum}>{r.server.count} ({r.withCache.count})</td>
                                    <td className={tdNum}><AvgP95 stats={r.withoutCache} /></td>
                                    <td className={tdNum}>{r.withoutCache.count ? <Ms ms={r.withoutCache.avgSqlMs} /> : "—"}</td>
                                    <td className={tdNum}>{r.withoutCache.count ? r.withoutCache.avgSqlCount.toFixed(0) : "—"}</td>
                                    <td className={tdNum}>{r.withCache.count ? <Ms ms={r.withCache.avgMs} /> : "—"}</td>
                                    <td className={tdNum}>{formatSpeedup(cacheSpeedup(r)?.factor ?? null)}</td>
                                    <td className={tdNum}>{r.server.count ? formatBytes(r.bytes.avg) : "—"}</td>
                                    <td className={tdNum}><AvgP95 stats={r.network} /></td>
                                </tr>
                            ))}
                        </tbody>
                    ))}
                </table>
            </div>
        </section>
    );
}
