"use client";

import React, { useMemo } from "react";
import { BarChartLib, BarChartSeriesConfig } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";
import { DurationStats, summarizeComponentRenders, summarizeRendersByType } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { RENDER_FRAME_MS, RENDER_LONG_TASK_MS, renderDurationColor } from "@/app/(ui)/_shared/adapter/duration.adapter";
import { card, formatMs, SectionTitle, td, tdNum, th, thNum } from "@/app/(ui)/components/dev-perf/dev-perf-ui";

const TYPE_CHART_SERIES: BarChartSeriesConfig[] = [
    { dataKey: "moyenne", label: "Rendu moyen" },
    { dataKey: "p95", label: "Rendu p95" },
    { dataKey: "max", label: "Rendu le plus long" },
];

const round1 = (ms: number) => Math.round(ms * 10) / 10;

/** Durée de rendu colorée avec les seuils propres au rendu (16 ms / 50 ms). */
function RenderMs({ ms }: { ms: number }) {
    return <span style={{ color: renderDurationColor(ms) }}>{formatMs(ms)}</span>;
}

function RenderAvgP95({ stats }: { stats: DurationStats }) {
    if (!stats.count) return <>—</>;
    return <><RenderMs ms={stats.avgMs} /> / <RenderMs ms={stats.p95Ms} /></>;
}

/** Onglet « Rendu des composants » : temps de rendu React de chaque bloc (graphiques, tableaux…). */
export function RendersTab({ client }: { client: ClientPerfRecord[] }) {
    const components = useMemo(() => summarizeComponentRenders(client), [client]);
    const byType = useMemo(() => summarizeRendersByType(client), [client]);

    return (
        <section className="flex flex-col gap-4">
            <SectionTitle
                title="Rendu des composants"
                hint={`Temps passé par React à rendre chaque bloc du moteur de sections (graphiques, tableaux, calendrier, hémicycle…), mesuré par <Profiler>. Un bloc est monté avant ses données (état de chargement) : le vrai rendu, quand les données arrivent, est un rendu suivant — d'où la colonne « plus long ». Orange au-delà de ${RENDER_FRAME_MS} ms (plus d'une image à 60 images/s), rouge à partir de ${RENDER_LONG_TASK_MS} ms (tâche longue qui bloque les clics).`}
            />

            <p className={`${card} text-sm text-subtitle-accent`}>
                React ne mesure ces rendus qu&apos;en mode dev (durées gonflées par les vérifications de React) ou dans un
                build de profilage : <code className="font-mono">npm run build:profile && npm run start</code>. Dans un build
                de prod ordinaire, cet onglet reste vide. Seuls les blocs du moteur de sections sont mesurés (pas les pages
                construites à la main, comme la liste des scrutins).
            </p>

            {components.length === 0 ? (
                <p className="text-sm text-subtitle-accent">
                    Aucun rendu mesuré : visite une fiche (groupe, député, scrutin) ou un chiffre clé dans un autre onglet.
                </p>
            ) : (
                <>
                    <div className={card}>
                        <BarChartLib
                            subtitle="Durée des rendus par type de composant (ms) : du plus coûteux au moins coûteux (p95)"
                            data={byType.map((t) => ({
                                label: t.blockType,
                                moyenne: round1(t.renders.avgMs),
                                p95: round1(t.renders.p95Ms),
                                max: round1(t.renders.maxMs),
                            }))}
                            series={TYPE_CHART_SERIES}
                            height={260}
                        />
                    </div>

                    <div className={`${card} overflow-x-auto`}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className={th}>Composant</th>
                                    <th className={th}>Type</th>
                                    <th className={thNum}>Rendus</th>
                                    <th className={thNum}>moy. / p95</th>
                                    <th className={thNum}>Plus long</th>
                                    <th className={thNum}>Montage</th>
                                    <th className={thNum}>Cumul</th>
                                    <th className={th}>Pages</th>
                                </tr>
                            </thead>
                            <tbody>
                                {components.map((c) => (
                                    <tr key={`${c.blockType}|${c.blockId}`}>
                                        <td className={`${td} font-mono`}>{c.blockId}</td>
                                        <td className={`${td} font-mono whitespace-nowrap`}>{c.blockType}</td>
                                        <td className={tdNum}>{c.renders.count}</td>
                                        <td className={tdNum}><RenderAvgP95 stats={c.renders} /></td>
                                        <td className={tdNum}><RenderMs ms={c.renders.maxMs} /></td>
                                        <td className={tdNum}>{c.mount.count ? <RenderMs ms={c.mount.avgMs} /> : "—"}</td>
                                        {/* Cumul de plusieurs rendus : pas coloré (ce n'est pas la durée d'un rendu). */}
                                        <td className={tdNum}>{formatMs(c.totalMs)}</td>
                                        <td className={`${td} font-mono text-xs`}>{c.paths.join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}
