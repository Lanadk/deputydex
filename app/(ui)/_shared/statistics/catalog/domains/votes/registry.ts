import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

// Premier backend réel pour "votes" (IVotesStatsRepository), branché sur
// scrutins_agregats — voir STAT_HANDLERS dans
// app/api/statistics/[domain]/[statId]/route.ts.
export const VOTES_STATS: StatDefinition[] = [
    defineStat("votes", "positions", {
        scope: "aggregate",
        title: "Répartition des positions de vote",
        category: "Positions de vote",
        keywords: ["votes", "pour", "contre", "abstention"],
        description: "Montre comment se répartissent les votes exprimés à l'Assemblée entre \"pour\", \"contre\", abstentions et non-votants.",
        methodology: "Répartition de l'ensemble des votes individuels par position (pour / contre / abstention / non-votant).",
        dataShape: "distribution",
        unit: "votes",
    }),
    defineStat("votes", "total", {
        scope: "aggregate",
        title: "Nombre cumulé de votes",
        category: "Positions de vote",
        keywords: ["votes", "total", "cumul", "volume"],
        description: "Le cumul de tous les votes individuels des député·es (pour, contre, abstention et non-votant confondus) sur la législature — pas le nombre de scrutins.",
        methodology: "Somme des positions de vote enregistrées sur l'ensemble des scrutins de la législature sélectionnée.",
        dataShape: "scalar",
        unit: "votes",
    }),
];
