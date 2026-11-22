"use client";

import React from "react";
import { PageSummary } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { WEB_VITAL_NAMES } from "@/app/_shared/dev-perf/dev-perf.types";
import { formatWebVital, WEB_VITAL_THRESHOLDS, webVitalColor } from "@/app/(ui)/_shared/adapter/web-vital.adapter";
import { AvgP95, card, Evolution, Ms, SectionTitle, td, tdNum, th, thNum } from "@/app/(ui)/components/dev-perf/dev-perf-ui";
import { VisitWaterfall } from "@/app/(ui)/components/dev-perf/visit-waterfall";

const VITAL_HINTS: Record<string, string> = {
    LCP: "Largest Contentful Paint : affichage du plus gros élément visible",
    FCP: "First Contentful Paint : premier contenu affiché",
    INP: "Interaction to Next Paint : réactivité aux clics (connue en quittant la page)",
    CLS: "Cumulative Layout Shift : sauts de mise en page (score, connu en quittant la page)",
    TTFB: "Time To First Byte : premier octet de la page reçu",
};

type PagesTabProps = {
    pages: PageSummary[];
    selectedPath: string | null;
    onSelectPath: (path: string) => void;
};

/** Onglet « Pages & rendu » : chargement de chaque page, appels simultanés, Web Vitals, cascade. */
export function PagesTab({ pages, selectedPath, onSelectPath }: PagesTabProps) {
    if (pages.length === 0) {
        return <p className="text-sm text-subtitle-accent">Aucune page mesurée : navigue sur le site dans un autre onglet.</p>;
    }
    const shown = pages.find((p) => p.path === selectedPath) ?? pages[0];

    return (
        <section className="flex flex-col gap-4">
            <SectionTitle
                title="Pages"
                hint="Une ligne par page, toutes visites regroupées. « Simultanés » : pic d'appels API en cours en même temps ; « attente » : durée vue du navigateur moins durée serveur (réseau et file d'attente du navigateur, qui grandit quand trop d'appels partent ensemble). Clique une page pour voir la cascade de sa dernière visite."
            />
            <div className={`${card} overflow-x-auto`}>
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={th}>Page</th>
                            <th className={thNum}>Visites</th>
                            <th className={thNum}>Durée (moy. / p95)</th>
                            <th className={thNum}>Appels API</th>
                            <th className={thNum}>Simultanés (max)</th>
                            <th className={thNum}>Attente moy.</th>
                            <th className={thNum}>1re → dernière visite</th>
                            <th className={thNum}>Cache (dernière)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((p) => (
                            <tr
                                key={p.path}
                                onClick={() => onSelectPath(p.path)}
                                className={`cursor-pointer hover:bg-surface-3 ${shown.path === p.path ? "bg-surface-3" : ""}`}
                            >
                                <td className={`${td} font-mono`}>{p.path}</td>
                                <td className={tdNum}>{p.visits}</td>
                                <td className={tdNum}><AvgP95 stats={p.duration} /></td>
                                <td className={tdNum}>{p.last.apiCalls}</td>
                                <td className={tdNum}>{p.last.maxConcurrent}</td>
                                <td className={tdNum}><Ms ms={p.last.avgWaitMs} /></td>
                                <td className={tdNum}>{p.visits > 1 ? <Evolution first={p.first} last={p.last} /> : "—"}</td>
                                <td className={tdNum}>{p.last.cachedCalls}/{p.last.apiCalls}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={`${card} overflow-x-auto`}>
                <h3 className="mb-1 font-semibold">Rendu : Web Vitals (p75 des visites)</h3>
                <p className="mb-3 text-sm text-subtitle-accent">
                    Vert : bon ; orange : à améliorer ; rouge : mauvais (seuils officiels de Google). Survole un en-tête pour sa définition.
                    INP et CLS ne sont connus qu&apos;en quittant la page. En mode dev, ces valeurs sont pessimistes : préfère un build de prod.
                </p>
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={th}>Page</th>
                            {WEB_VITAL_NAMES.map((name) => (
                                <th
                                    key={name}
                                    className={thNum}
                                    title={`${VITAL_HINTS[name]} — bon ≤ ${formatWebVital(name, WEB_VITAL_THRESHOLDS[name].good)}, mauvais > ${formatWebVital(name, WEB_VITAL_THRESHOLDS[name].poor)}`}
                                >
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((p) => (
                            <tr key={p.path}>
                                <td className={`${td} font-mono`}>{p.path}</td>
                                {WEB_VITAL_NAMES.map((name) => {
                                    const v = p.vitals[name];
                                    return (
                                        <td key={name} className={tdNum}>
                                            {v ? <span style={{ color: webVitalColor(name, v.p75) }}>{formatWebVital(name, v.p75)}</span> : "—"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={card}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold">
                        Dernière visite de <span className="font-mono">{shown.path}</span>
                    </span>
                    <span className="text-sm text-subtitle-accent tabular-nums">
                        <Ms ms={shown.last.durationMs} /> · SQL <Ms ms={shown.last.sqlMs} /> · {shown.last.maxConcurrent} appels simultanés au pic ·
                        {" "}cache {shown.last.cachedCalls}/{shown.last.apiCalls}
                    </span>
                </div>
                <VisitWaterfall visit={shown.lastVisit} />
            </div>
        </section>
    );
}
