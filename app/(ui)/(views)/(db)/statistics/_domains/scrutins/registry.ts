import { defineStat } from "@/app/(ui)/(views)/(db)/statistics/_catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

// Aucun backend "scrutins" n'existe encore (ni repository, ni use-case) —
// cette entrée est entièrement mockée côté serveur (STAT_HANDLERS) en attendant.
export const SCRUTINS_STATS: StatDefinition[] = [
    defineStat("scrutins", "participation", {
        scope: "aggregate",
        title: "Évolution du taux de participation",
        category: "Participation",
        keywords: ["scrutins", "participation", "évolution"],
        methodology: "Taux moyen de participation aux scrutins, calculé mois par mois sur la législature en cours.",
        dataShape: "timeseries",
        unit: "%",
    }),
];
