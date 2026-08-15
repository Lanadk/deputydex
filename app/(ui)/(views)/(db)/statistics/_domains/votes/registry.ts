import { defineStat } from "@/app/(ui)/(views)/(db)/statistics/_catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

// Aucun backend "votes" n'existe encore (ni repository, ni use-case) — cette
// entrée est entièrement mockée côté serveur (STAT_HANDLERS) en attendant.
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
