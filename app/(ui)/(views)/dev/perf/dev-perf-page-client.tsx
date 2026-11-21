"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { ToggleSwitchLib } from "@/app/(ui)/component-library/molecules/toggle-switch/toggle-switch-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";
import {
    cacheGain,
    comparePageVisits,
    domainChartRows,
    DurationStats,
    groupPageVisits,
    PageVisit,
    requestChartRows,
    slowestQueries,
    summarizeByDomain,
    VisitStats,
} from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { BarChartLib, BarChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { parseServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";

const REFRESH_MS = 2000;
const API = "/api/dev/perf";

/** Séries des graphiques : SQL + hors SQL empilés = serveur sans cache. */
const PERF_CHART_SERIES: BarChartSeriesConfig[] = [
    { dataKey: "sql", label: "SQL", stack: "serveur" },
    { dataKey: "horsSql", label: "Serveur hors SQL", stack: "serveur" },
    { dataKey: "cache", label: "Serveur avec cache" },
    { dataKey: "reseau", label: "Réseau (navigateur)" },
];

const VISIT_COMPARISON_SERIES: BarChartSeriesConfig[] = [
    { dataKey: "premiere", label: "Première visite" },
    { dataKey: "derniere", label: "Dernière visite" },
];

function formatMs(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}

/** « moy. / p95 (n) », ou « — » sans mesure. */
function formatStats(s: DurationStats): string {
    return s.count ? `${formatMs(s.avgMs)} / ${formatMs(s.p95Ms)} (${s.count})` : "—";
}

/** « −98 % (101 ms) », ou « — » tant qu'il manque des appels avec ou sans cache. */
function formatGain(gain: { ratio: number; savedMs: number } | null): string {
    if (!gain) return "—";
    return `${gain.ratio >= 0 ? "−" : "+"}${Math.abs(Math.round(gain.ratio * 100))} % (${formatMs(Math.abs(gain.savedMs))})`;
}

/** « 473 ms · SQL 794 ms · cache 0/10 » */
function formatVisit(v: VisitStats): string {
    return `${formatMs(v.durationMs)} · SQL ${formatMs(v.sqlMs)} · cache ${v.cachedCalls}/${v.apiCalls}`;
}

/** Écart de la dernière visite par rapport à la première : « −312 ms (−66 %) ». */
function formatDelta(firstMs: number, lastMs: number): string {
    const delta = lastMs - firstMs;
    const pct = firstMs > 0 ? Math.round((delta / firstMs) * 100) : 0;
    const sign = delta <= 0 ? "−" : "+";
    return `${sign}${formatMs(Math.abs(delta))} (${sign}${Math.abs(pct)} %)`;
}

function SectionTitle({ title, hint }: { title: string; hint: string }) {
    return (
        <div className="mb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-subtitle-accent">{hint}</p>
        </div>
    );
}

/** Une ligne de cascade : libellé, barre positionnée sur la durée de la visite, durée. */
function WaterfallRow({ label, detail, startMs, durationMs, totalMs, color, failed = false }: {
    label: string;
    detail?: string;
    startMs: number;
    durationMs: number;
    totalMs: number;
    color: string;
    failed?: boolean;
}) {
    const left = totalMs > 0 ? (startMs / totalMs) * 100 : 0;
    const width = totalMs > 0 ? Math.max((durationMs / totalMs) * 100, 0.6) : 0;
    return (
        <div className="grid grid-cols-[minmax(0,14rem)_1fr_11rem] items-center gap-3 text-xs">
            <span className="truncate font-mono" title={label}>{label}</span>
            <div className="relative h-3 rounded bg-surface-3">
                <div
                    className="absolute inset-y-0 rounded"
                    style={{ left: `${left}%`, width: `${width}%`, background: failed ? "var(--ui-danger)" : color }}
                />
            </div>
            <span className="tabular-nums text-right text-subtitle-accent">
                {formatMs(durationMs)}{detail ? ` · ${detail}` : ""}
            </span>
        </div>
    );
}

function VisitCard({ visit }: { visit: PageVisit }) {
    const sqlTotal = visit.fetches.reduce((sum, f) => sum + (parseServerTiming(f.serverTiming)?.sqlMs ?? 0), 0);
    return (
        <div className="rounded-lg border border-main bg-card p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono font-semibold">{visit.path}</span>
                <span className="text-sm text-subtitle-accent tabular-nums">
                    {formatMs(visit.durationMs)} jusqu&apos;à la dernière donnée · {visit.sections.length} sections ·{" "}
                    {visit.fetches.length} appels API · SQL {formatMs(sqlTotal)}
                </span>
            </div>

            {visit.sections.length > 0 && (
                <div className="mb-3 flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent">Sections</span>
                    {visit.sections.map((s, i) => (
                        <WaterfallRow
                            key={`${s.sectionId}-${i}`}
                            label={s.sectionId}
                            startMs={s.startMs}
                            durationMs={s.durationMs}
                            totalMs={visit.durationMs}
                            color="var(--accent)"
                            failed={!s.ok}
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent">Appels API</span>
                {visit.fetches.map((f, i) => {
                    const timing = parseServerTiming(f.serverTiming);
                    const detail = timing
                        ? `SQL ${formatMs(timing.sqlMs)} (${timing.sqlCount})${timing.cacheHit ? " · cache" : ""}`
                        : undefined;
                    return (
                        <WaterfallRow
                            key={`${f.url}-${i}`}
                            label={f.url}
                            detail={detail}
                            startMs={f.startMs}
                            durationMs={f.durationMs}
                            totalMs={visit.durationMs}
                            // Couleur neutre : le rouge est réservé aux échecs (--chart-2 est le rouge « contre »).
                            color="var(--subtitle-accent)"
                            failed={f.status >= 400}
                        />
                    );
                })}
            </div>
        </div>
    );
}

const th = "py-2 pr-4 text-left font-medium text-subtitle-accent";
const thNum = "py-2 pr-4 text-right font-medium text-subtitle-accent";
const td = "py-1.5 pr-4 border-t border-main";
const tdNum = `${td} text-right tabular-nums whitespace-nowrap`;

export default function DevPerfPageClient() {
    const [snapshot, setSnapshot] = useState<DevPerfSnapshot>({ apiCalls: [], client: [] });
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [failed, setFailed] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await fetch(API, { cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            setSnapshot(await res.json());
            setFailed(false);
        } catch {
            setFailed(true);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
        if (!autoRefresh) return;
        const timer = setInterval(load, REFRESH_MS);
        return () => clearInterval(timer);
    }, [autoRefresh, load]);

    const clear = async () => {
        await fetch(API, { method: "DELETE" });
        await load();
    };

    const domains = useMemo(() => summarizeByDomain(snapshot.apiCalls, snapshot.client), [snapshot]);
    const queries = useMemo(() => slowestQueries(snapshot.apiCalls), [snapshot.apiCalls]);
    const visits = useMemo(() => groupPageVisits(snapshot.client), [snapshot.client]);
    const comparisons = useMemo(() => comparePageVisits(snapshot.client), [snapshot.client]);

    const calls = snapshot.apiCalls;
    const sqlCount = calls.reduce((sum, c) => sum + c.sqlCount, 0);
    const avgMs = calls.length ? calls.reduce((sum, c) => sum + c.totalMs, 0) / calls.length : 0;
    const hitRate = calls.length ? calls.filter((c) => c.cacheHit).length / calls.length : 0;

    return (
        <BaseLayout>
            <div className="mb-6 border-b border-main pb-6">
                <PageHeaderLib
                    title="Performances (dev)"
                    subtitle="Ouvre une page du site dans un autre onglet, puis reviens ici : temps de chaque section, appels API, durée et nombre de requêtes SQL, cache. Mesures gardées en mémoire du serveur (500 dernières)."
                />
                <p className="mt-2 text-sm text-subtitle-accent">
                    En mode dev, les durées de rendu sont faussées (compilation à la première visite, double montage
                    du mode strict) : compare des mesures faites dans les mêmes conditions. Les durées SQL sont fiables.
                    Mesures sans biais : <code className="font-mono">npm run build && npm run start</code>. Pour mesurer
                    avec cache, ajoute <code className="font-mono">DEV_PERF_CACHE=true</code> dans <code className="font-mono">.env.local</code>.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4">
                <ToggleSwitchLib isActive={autoRefresh} onToggle={() => setAutoRefresh((v) => !v)} label="Actualisation auto (2 s)" />
                <ButtonLib text="Actualiser" variant="secondary" size="small" onClick={load} />
                <ButtonLib text="Vider les mesures" variant="tertiary" size="small" onClick={clear} />
                {failed && <span className="text-sm" style={{ color: "var(--ui-danger)" }}>Lecture des mesures impossible.</span>}
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCardLib kpiValue={calls.length} kpiLabel="appels API mesurés" />
                <KpiCardLib kpiValue={formatMs(avgMs)} kpiLabel="durée moyenne d'un appel (serveur)" />
                <KpiCardLib kpiValue={sqlCount} kpiLabel="requêtes SQL" />
                <KpiCardLib kpiValue={`${Math.round(hitRate * 100)} %`} kpiLabel="servis par le cache" />
            </div>

            <section className="mb-10">
                <SectionTitle
                    title="Visites de pages"
                    hint="Cascade par visite : quand chaque section et chaque appel API commence et finit. Rouge : échec."
                />
                {visits.length === 0 ? (
                    <p className="text-sm text-subtitle-accent">Aucune visite mesurée pour l&apos;instant.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {visits.map((v) => <VisitCard key={v.visitId} visit={v} />)}
                    </div>
                )}
            </section>

            <section className="mb-10">
                <SectionTitle
                    title="Même page : première visite / dernière visite"
                    hint="Pour chaque page visitée au moins deux fois. Avec le cache actif (DEV_PERF_CACHE=true), la première visite exécute le SQL et la suivante est servie par le cache : l'écart mesure son gain."
                />
                {comparisons.length === 0 ? (
                    <p className="text-sm text-subtitle-accent">
                        Visite une même page deux fois (par exemple une fiche, puis reviens dessus) pour la comparer.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg border border-main bg-card p-4">
                            <BarChartLib
                                subtitle="Durée jusqu'à la dernière donnée (ms)"
                                data={comparisons.map((c) => ({
                                    label: c.path,
                                    premiere: Math.round(c.first.durationMs),
                                    derniere: Math.round(c.last.durationMs),
                                }))}
                                series={VISIT_COMPARISON_SERIES}
                                height={260}
                            />
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-main bg-card p-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className={th}>Page</th>
                                        <th className={thNum}>Visites</th>
                                        <th className={thNum}>Première visite</th>
                                        <th className={thNum}>Dernière visite</th>
                                        <th className={thNum}>Écart</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisons.map((c) => (
                                        <tr key={c.path}>
                                            <td className={`${td} font-mono`}>{c.path}</td>
                                            <td className={tdNum}>{c.visits}</td>
                                            <td className={tdNum}>{formatVisit(c.first)}</td>
                                            <td className={tdNum}>{formatVisit(c.last)}</td>
                                            <td className={tdNum}>{formatDelta(c.first.durationMs, c.last.durationMs)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>

            <section className="mb-10">
                <SectionTitle
                    title="Par domaine et par requête"
                    hint="Côté serveur : sans cache (use-case exécuté, avec son SQL) et avec cache. Côté navigateur : durée réseau (fetch complet). Format « moyenne / p95 (nombre de mesures) ». Requêtes de la plus lente à la plus rapide (p95 sans cache)."
                />
                {domains.length === 0 ? (
                    <p className="text-sm text-subtitle-accent">Aucun appel mesuré.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg border border-main bg-card p-4">
                            <BarChartLib
                                title="Vue d'ensemble par domaine"
                                subtitle="Durée moyenne d'un appel (ms) : serveur sans cache (SQL + hors SQL), serveur avec cache, réseau vu du navigateur"
                                data={domainChartRows(domains)}
                                series={PERF_CHART_SERIES}
                                height={280}
                            />
                        </div>
                        {domains.map((d) => (
                            <div key={d.domain} className="overflow-x-auto rounded-lg border border-main bg-card p-4">
                                <h3 className="mb-2 font-semibold">{d.domain}</h3>
                                <BarChartLib
                                    subtitle="Durée moyenne par requête (ms)"
                                    data={requestChartRows(d.requests)}
                                    series={PERF_CHART_SERIES}
                                    height={260}
                                />
                                <table className="mt-4 w-full text-sm">
                                    <thead>
                                        <tr>
                                            <th className={th}>Requête</th>
                                            <th className={thNum}>Serveur sans cache</th>
                                            <th className={thNum}>dont SQL</th>
                                            <th className={thNum}>Requêtes SQL</th>
                                            <th className={thNum}>Serveur avec cache</th>
                                            <th className={thNum}>Gain du cache</th>
                                            <th className={thNum}>Réseau (navigateur)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {d.requests.map((r) => (
                                            <tr key={r.family}>
                                                <td className={`${td} font-mono`}>{r.family}</td>
                                                <td className={tdNum}>{formatStats(r.withoutCache)}</td>
                                                <td className={tdNum}>{r.withoutCache.count ? formatMs(r.withoutCache.avgSqlMs) : "—"}</td>
                                                <td className={tdNum}>{r.withoutCache.count ? r.withoutCache.avgSqlCount.toFixed(1) : "—"}</td>
                                                <td className={tdNum}>{formatStats(r.withCache)}</td>
                                                <td className={tdNum}>{formatGain(cacheGain(r))}</td>
                                                <td className={tdNum}>{formatStats(r.network)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="mb-10">
                <SectionTitle title="Requêtes SQL les plus lentes" hint="Les 20 plus lentes, toutes routes confondues. Survole le texte pour la requête complète." />
                <div className="overflow-x-auto rounded-lg border border-main bg-card p-4">
                    {/* Largeurs fixes : sinon le texte SQL (sécable partout) est écrasé à quelques caractères. */}
                    <table className="w-full table-fixed text-sm">
                        <colgroup>
                            <col className="w-24" />
                            <col className="w-72" />
                            <col />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className={thNum}>Durée</th>
                                <th className={th}>Endpoint</th>
                                <th className={th}>Requête</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.map((q, i) => (
                                <tr key={i}>
                                    <td className={`${tdNum} align-top`}>{formatMs(q.durationMs)}</td>
                                    <td className={`${td} align-top font-mono truncate`} title={q.endpoint}>{q.endpoint}</td>
                                    <td className={td}>
                                        <code className="line-clamp-2 font-mono text-xs break-all" title={q.text}>{q.text}</code>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {queries.length === 0 && <p className="pt-2 text-sm text-subtitle-accent">Aucune requête SQL mesurée.</p>}
                </div>
            </section>
        </BaseLayout>
    );
}
