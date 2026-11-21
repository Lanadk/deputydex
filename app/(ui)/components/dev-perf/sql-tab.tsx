"use client";

import React from "react";
import { SqlQuerySummary } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { AvgP95, card, formatMs, Ms, SectionTitle, td, tdNum, th, thNum } from "@/app/(ui)/components/dev-perf/dev-perf-ui";

/** Onglet « SQL » : requêtes regroupées par texte, triées par temps cumulé. */
export function SqlTab({ queries }: { queries: SqlQuerySummary[] }) {
    return (
        <section>
            <SectionTitle
                title="Requêtes SQL les plus coûteuses"
                hint="Regroupées par texte, triées par temps cumulé (exécutions × durée) : ce qui pèse vraiment sur la base. Survole le texte pour la requête complète. Une réponse du cache n'exécute pas de SQL."
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
                            <th className={th}>Requêtes API</th>
                            <th className={th}>SQL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queries.map((q) => (
                            <tr key={q.text}>
                                {/* Total sur plusieurs exécutions : pas coloré (ce n'est pas la durée d'un appel). */}
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
                {queries.length === 0 && <p className="pt-2 text-sm text-subtitle-accent">Aucune requête SQL mesurée.</p>}
            </div>
        </section>
    );
}
