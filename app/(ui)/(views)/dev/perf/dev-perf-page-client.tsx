"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { ToggleSwitchLib } from "@/app/(ui)/component-library/molecules/toggle-switch/toggle-switch-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { BarChartLib, BarChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { LineChartLib, LineChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/line-chart/line-chart-lib";
import { DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";
import { DEV_PERF_MAX_RECORDS } from "@/app/_shared/dev-perf/dev-perf.config";
import {
    cacheSpeedup,
    DISTRIBUTION_PERCENTILES,
    distributionChartRows,
    domainChartRows,
    DurationStats,
    groupSqlQueries,
    liveData,
    PageVisit,
    summarizeByDomain,
    summarizePages,
    VisitStats,
} from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { parseServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";
import { durationColor } from "@/app/(ui)/_shared/adapter/duration.adapter";

const REFRESH_MS = 2000;
const API = "/api/dev/perf";
const ALL_REQUESTS = "*";

const WINDOWS: { label: string; ms: number | null }[] = [
    { label: "1 min", ms: 60_000 },
    { label: "5 min", ms: 300_000 },
    { label: "Tout", ms: null },
];

/** Vue en direct : trois durées du même appel, du plus englobant au plus précis, puis la tendance. */
const LIVE_SERIES: LineChartSeriesConfig[] = [
    { dataKey: "navigateur", label: "Navigateur" },
    { dataKey: "serveur", label: "Serveur" },
    { dataKey: "base", label: "Base de données" },
    { dataKey: "tendance", label: "Tendance navigateur (10 appels)" },
];

/** Distribution : mêmes trois durées que la vue en direct. */
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

/** Vue d'ensemble : SQL + hors SQL empilés = serveur sans cache. */
const DOMAIN_CHART_SERIES: BarChartSeriesConfig[] = [
    { dataKey: "sql", label: "Base de données (SQL)", stack: "serveur" },
    { dataKey: "horsSql", label: "Serveur hors SQL", stack: "serveur" },
    { dataKey: "reseau", label: "Navigateur (réseau + serveur)" },
];

// ── Formats ───────────────────────────────────────────────────────────────

/** Durée lisible, au dixième de ms sous 10 ms (une réponse du cache mesure souvent < 1 ms). */
function formatMs(ms: number): string {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2).replace(".", ",")} s`;
    if (ms < 10) return `${ms.toFixed(1).replace(".", ",")} ms`;
    return `${Math.round(ms)} ms`;
}

const formatAvgP95 = (s: DurationStats) => (s.count ? `${formatMs(s.avgMs)} / ${formatMs(s.p95Ms)}` : "—");

/**
 * Facteur d'accélération du cache : « ×36 ». Au-delà de ×100 (réponse du cache
 * sous la milliseconde), le chiffre exact n'apporte plus rien : « ×100+ ».
 */
function formatSpeedup(speedup: ReturnType<typeof cacheSpeedup>): string {
    if (!speedup) return "—";
    if (speedup.factor >= 100) return "×100+";
    return `×${speedup.factor >= 10 ? Math.round(speedup.factor) : speedup.factor.toFixed(1).replace(".", ",")}`;
}

// ── Petits composants ─────────────────────────────────────────────────────

/** Durée colorée selon sa lenteur : orange de 100 à 200 ms, rouge au-delà (voir duration.adapter). */
function Ms({ ms }: { ms: number }) {
    return <span style={{ color: durationColor(ms) }}>{formatMs(ms)}</span>;
}

/** « moy. / p95 », chaque valeur colorée ; « — » sans mesure. */
function AvgP95({ stats }: { stats: DurationStats }) {
    if (!stats.count) return <>—</>;
    return <><Ms ms={stats.avgMs} /> / <Ms ms={stats.p95Ms} /></>;
}

/** « 412 ms → 108 ms (−74 %) », durées colorées. */
function Evolution({ first, last }: { first: VisitStats; last: VisitStats }) {
    const pct = first.durationMs > 0 ? Math.round(((last.durationMs - first.durationMs) / first.durationMs) * 100) : 0;
    return (
        <>
            <Ms ms={first.durationMs} /> → <Ms ms={last.durationMs} /> ({pct > 0 ? "+" : pct < 0 ? "−" : ""}{Math.abs(pct)} %)
        </>
    );
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
    detail?: React.ReactNode;
    startMs: number;
    durationMs: number;
    totalMs: number;
    color: string;
    failed?: boolean;
}) {
    const left = totalMs > 0 ? (startMs / totalMs) * 100 : 0;
    const width = totalMs > 0 ? Math.max((durationMs / totalMs) * 100, 0.6) : 0;
    return (
        <div className="grid grid-cols-[minmax(0,16rem)_1fr_12rem] items-center gap-3 text-xs">
            <span className="truncate font-mono" title={label}>{label}</span>
            <div className="relative h-3 rounded bg-surface-3">
                <div
                    className="absolute inset-y-0 rounded"
                    style={{ left: `${left}%`, width: `${width}%`, background: failed ? "var(--ui-danger)" : color }}
                />
            </div>
            <span className="tabular-nums text-right text-subtitle-accent">
                <Ms ms={durationMs} />{detail ? <> · {detail}</> : null}
            </span>
        </div>
    );
}

function VisitWaterfall({ visit }: { visit: PageVisit }) {
    return (
        <div className="flex flex-col gap-1.5">
            {visit.sections.length > 0 && (
                <span className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent">Sections</span>
            )}
            {visit.sections.map((s, i) => (
                <WaterfallRow
                    key={`s-${s.sectionId}-${i}`}
                    label={s.sectionId}
                    startMs={s.startMs}
                    durationMs={s.durationMs}
                    totalMs={visit.durationMs}
                    color="var(--accent)"
                    failed={!s.ok}
                />
            ))}
            <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-subtitle-accent">Appels API</span>
            {visit.fetches.map((f, i) => {
                const timing = parseServerTiming(f.serverTiming);
                const detail = timing ? <>SQL <Ms ms={timing.sqlMs} />{timing.cacheHit ? " · cache" : ""}</> : undefined;
                return (
                    <WaterfallRow
                        key={`f-${f.url}-${i}`}
                        label={f.url}
                        detail={detail}
                        startMs={f.startMs}
                        durationMs={f.durationMs}
                        totalMs={visit.durationMs}
                        // Couleur neutre : le rouge est réservé aux échecs.
                        color="var(--subtitle-accent)"
                        failed={f.status >= 400}
                    />
                );
            })}
        </div>
    );
}

const th = "py-2 pr-4 text-left font-medium text-subtitle-accent whitespace-nowrap";
const thNum = "py-2 pr-4 text-right font-medium text-subtitle-accent whitespace-nowrap";
const td = "py-1.5 pr-4 border-t border-main";
const tdNum = `${td} text-right tabular-nums whitespace-nowrap`;
const card = "rounded-lg border border-main bg-card p-4";

// ── Page ──────────────────────────────────────────────────────────────────

export default function DevPerfPageClient() {
    const [snapshot, setSnapshot] = useState<DevPerfSnapshot>({ apiCalls: [], client: [] });
    const [loadedAt, setLoadedAt] = useState(0);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [failed, setFailed] = useState(false);
    // « Tout » par défaut : une fenêtre glissante viderait le graphique dès qu'on cesse de naviguer.
    const [windowMs, setWindowMs] = useState<number | null>(null);
    const [family, setFamily] = useState<string | null>(null);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const res = await fetch(API, { cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            setSnapshot(await res.json());
            setLoadedAt(Date.now());
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
        setFamily(null);
        setSelectedPath(null);
        await load();
    };

    const [cacheCleared, setCacheCleared] = useState(false);
    const clearServerCache = async () => {
        const res = await fetch(`${API}/cache`, { method: "DELETE" });
        setCacheCleared(res.ok);
    };

    const live = useMemo(
        () => liveData(snapshot.client, { now: loadedAt, windowMs, family }),
        [snapshot.client, loadedAt, windowMs, family]
    );
    const domains = useMemo(() => summarizeByDomain(snapshot.apiCalls, snapshot.client), [snapshot]);
    const pages = useMemo(() => summarizePages(snapshot.client), [snapshot.client]);
    const sqlQueries = useMemo(() => groupSqlQueries(snapshot.apiCalls), [snapshot.apiCalls]);

    // ALL_REQUESTS et non "" : SelectLib affiche son placeholder pour une valeur vide.
    const familyOptions = useMemo(() => [
        { value: ALL_REQUESTS, label: "Toutes les requêtes" },
        ...domains.flatMap((d) => d.requests.map((r) => ({ value: r.family, label: `${d.domain} · ${r.family}` }))),
    ], [domains]);
    const shownPage = pages.find((p) => p.path === selectedPath) ?? pages[0];

    return (
        <BaseLayout>
            <div className="mb-6 border-b border-main pb-6">
                <PageHeaderLib
                    title="Performances (dev)"
                    subtitle="Navigue sur le site dans un autre onglet : chaque appel d'API, sa durée côté base de données, serveur et navigateur, et l'effet du cache apparaissent ici en direct."
                />
                <p className="mt-2 text-sm text-subtitle-accent">
                    En mode dev, les durées de rendu sont faussées (compilation à la première visite, double montage
                    du mode strict) ; les durées SQL sont fiables. Mesures sans biais :{" "}
                    <code className="font-mono">npm run build && npm run start</code>. Cache local :{" "}
                    <code className="font-mono">DEV_PERF_CACHE=true</code> dans <code className="font-mono">.env.local</code>.
                </p>
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-4">
                <ToggleSwitchLib isActive={autoRefresh} onToggle={() => setAutoRefresh((v) => !v)} label="Direct (2 s)" />
                <ButtonLib text="Actualiser" variant="secondary" size="small" onClick={load} />
                <ButtonLib text="Vider les mesures" variant="tertiary" size="small" onClick={clear} />
                <ButtonLib text="Vider le cache serveur" variant="tertiary" size="small" onClick={clearServerCache} />
                {cacheCleared && (
                    <span className="text-sm text-subtitle-accent">
                        Cache vidé : la prochaine visite d&apos;une page sera « à froid ».
                    </span>
                )}
                {failed && <span className="text-sm" style={{ color: "var(--ui-danger)" }}>Lecture des mesures impossible.</span>}
                <span className="ml-auto text-sm text-subtitle-accent tabular-nums">
                    Mesures en mémoire : {snapshot.apiCalls.length} appels serveur, {snapshot.client.length} navigateur
                    {" "}(max. {DEV_PERF_MAX_RECORDS} chacun, les plus anciennes sont oubliées ; vidées au redémarrage)
                </span>
            </div>

            {/* ── En direct ─────────────────────────────────────────── */}
            <section className="mb-10">
                <SectionTitle
                    title="En direct"
                    hint="Chaque point de l'axe horizontal est un appel d'API, dans l'ordre où il a eu lieu (heure · requête). Pour chaque appel : la durée vue du navigateur (ce qu'attend l'utilisateur), dont le temps passé sur le serveur, dont le temps passé dans la base de données. La ligne « Base de données » s'interrompt sur les appels servis par le cache. « Tendance » lisse le navigateur sur les 10 derniers appels. Survole un point pour ses valeurs."
                />
                <div className="mb-4 flex flex-wrap items-end gap-3">
                    {WINDOWS.map((w) => (
                        <ButtonLib
                            key={w.label}
                            text={w.label}
                            size="small"
                            variant={windowMs === w.ms ? "primary" : "tertiary"}
                            onClick={() => setWindowMs(w.ms)}
                        />
                    ))}
                    <div className="min-w-72">
                        <SelectLib
                            options={familyOptions}
                            value={family ?? ALL_REQUESTS}
                            onChange={(v) => setFamily(v === ALL_REQUESTS ? null : v)}
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

                <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
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

                <div className={card}>
                    <LineChartLib
                        subtitle={`${family ? `Requête suivie : ${family}` : "Toutes les requêtes"} · ${live.rows.length} derniers appels · durées en ms`}
                        data={live.rows}
                        series={LIVE_SERIES}
                        height={340}
                        emptyLabel="Aucun appel sur cette fenêtre : navigue sur le site dans un autre onglet"
                    />
                </div>
            </section>

            {/* ── Requêtes ──────────────────────────────────────────── */}
            <section className="mb-10">
                <SectionTitle
                    title="Requêtes"
                    hint="Toutes les mesures regroupées par requête et par domaine, appels sans cache (use-case et SQL exécutés) et avec cache séparés. « moy. / p95 ». Clique une requête pour la suivre en direct."
                />
                {domains.length === 0 ? (
                    <p className="text-sm text-subtitle-accent">Aucun appel mesuré.</p>
                ) : (
                    <div className="flex flex-col gap-4">
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
                                        <th className={thNum}>Navigateur</th>
                                    </tr>
                                </thead>
                                {domains.map((d) => (
                                    <tbody key={d.domain}>
                                        <tr>
                                            <td colSpan={8} className="pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-subtitle-accent">
                                                {d.domain}
                                            </td>
                                        </tr>
                                        {d.requests.map((r) => (
                                            <tr
                                                key={r.family}
                                                onClick={() => setFamily(family === r.family ? null : r.family)}
                                                className={`cursor-pointer hover:bg-surface-3 ${family === r.family ? "bg-surface-3" : ""}`}
                                            >
                                                <td className={`${td} font-mono`}>{r.family}</td>
                                                <td className={tdNum}>{r.server.count} ({r.withCache.count})</td>
                                                <td className={tdNum}><AvgP95 stats={r.withoutCache} /></td>
                                                <td className={tdNum}>{r.withoutCache.count ? <Ms ms={r.withoutCache.avgSqlMs} /> : "—"}</td>
                                                <td className={tdNum}>{r.withoutCache.count ? r.withoutCache.avgSqlCount.toFixed(0) : "—"}</td>
                                                <td className={tdNum}>{r.withCache.count ? <Ms ms={r.withCache.avgMs} /> : "—"}</td>
                                                <td className={tdNum}>{formatSpeedup(cacheSpeedup(r))}</td>
                                                <td className={tdNum}><AvgP95 stats={r.network} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div>
                )}
            </section>

            {/* ── Pages ─────────────────────────────────────────────── */}
            <section className="mb-10">
                <SectionTitle
                    title="Pages"
                    hint="Une ligne par page, toutes visites regroupées : durée jusqu'à la dernière donnée (moy. / p95), et évolution de la première à la dernière visite (avec le cache : froid puis chaud). Clique une page pour voir la cascade de sa dernière visite."
                />
                {pages.length === 0 ? (
                    <p className="text-sm text-subtitle-accent">Aucune page mesurée pour l&apos;instant.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className={`${card} overflow-x-auto`}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className={th}>Page</th>
                                        <th className={thNum}>Visites</th>
                                        <th className={thNum}>Durée</th>
                                        <th className={thNum}>Appels API</th>
                                        <th className={thNum}>1re → dernière visite</th>
                                        <th className={thNum}>Cache (dernière)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pages.map((p) => (
                                        <tr
                                            key={p.path}
                                            onClick={() => setSelectedPath(p.path)}
                                            className={`cursor-pointer hover:bg-surface-3 ${shownPage?.path === p.path ? "bg-surface-3" : ""}`}
                                        >
                                            <td className={`${td} font-mono`}>{p.path}</td>
                                            <td className={tdNum}>{p.visits}</td>
                                            <td className={tdNum}><AvgP95 stats={p.duration} /></td>
                                            <td className={tdNum}>{p.last.apiCalls}</td>
                                            <td className={tdNum}>{p.visits > 1 ? <Evolution first={p.first} last={p.last} /> : "—"}</td>
                                            <td className={tdNum}>{p.last.cachedCalls}/{p.last.apiCalls}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {shownPage && (
                            <div className={card}>
                                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                                    <span className="font-semibold">
                                        Dernière visite de <span className="font-mono">{shownPage.path}</span>
                                    </span>
                                    <span className="text-sm text-subtitle-accent tabular-nums">
                                        <Ms ms={shownPage.last.durationMs} /> · SQL <Ms ms={shownPage.last.sqlMs} /> · cache{" "}
                                        {shownPage.last.cachedCalls}/{shownPage.last.apiCalls}
                                    </span>
                                </div>
                                <VisitWaterfall visit={shownPage.lastVisit} />
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ── SQL ───────────────────────────────────────────────── */}
            <section className="mb-10">
                <SectionTitle
                    title="Requêtes SQL les plus coûteuses"
                    hint="Regroupées par texte, triées par temps cumulé (exécutions × durée) : ce qui pèse vraiment sur la base. Survole le texte pour la requête complète."
                />
                <div className={`${card} overflow-x-auto`}>
                    {/* Largeurs fixes : sinon le texte SQL (sécable partout) est écrasé à quelques caractères. */}
                    <table className="w-full table-fixed text-sm">
                        <colgroup>
                            <col className="w-24" />
                            <col className="w-20" />
                            <col className="w-36" />
                            <col className="w-20" />
                            <col className="w-56" />
                            <col />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className={thNum}>Temps cumulé</th>
                                <th className={thNum}>Exécutions</th>
                                <th className={thNum}>Moy. / p95</th>
                                <th className={thNum}>Max</th>
                                <th className={th}>Requêtes</th>
                                <th className={th}>SQL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sqlQueries.map((q) => (
                                <tr key={q.text}>
                                    <td className={`${tdNum} align-top`}>{formatMs(q.totalMs)}</td>
                                    <td className={`${tdNum} align-top`}>{q.count}</td>
                                    <td className={`${tdNum} align-top`}><AvgP95 stats={q} /></td>
                                    <td className={`${tdNum} align-top`}><Ms ms={q.maxMs} /></td>
                                    <td className={`${td} align-top font-mono text-xs truncate`} title={q.families.join(", ")}>
                                        {q.families.join(", ")}
                                    </td>
                                    <td className={td}>
                                        <code className="line-clamp-2 font-mono text-xs break-all" title={q.text}>{q.text}</code>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sqlQueries.length === 0 && <p className="pt-2 text-sm text-subtitle-accent">Aucune requête SQL mesurée.</p>}
                </div>
            </section>
        </BaseLayout>
    );
}
