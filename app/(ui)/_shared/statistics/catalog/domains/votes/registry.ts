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
        methodology: "Répartition de l'ensemble des votes individuels par position (pour / contre / abstention / non-votant).",
        dataShape: "distribution",
        unit: "votes",
    }),
];
