import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

// Premier backend réel pour "scrutins" (IScrutinsStatsRepository), branché
// sur scrutins/scrutins_agregats — voir STAT_HANDLERS dans
// app/api/statistics/[domain]/[statId]/route.ts.
export const SCRUTINS_STATS: StatDefinition[] = [
    defineStat("scrutins", "participation", {
        scope: "aggregate",
        title: "Évolution du taux de participation",
        category: "Participation",
        keywords: ["scrutins", "participation", "évolution"],
        description: "Montre si les députés participent de plus en plus, ou de moins en moins, aux scrutins au fil des mois.",
        methodology: "Taux moyen de participation aux scrutins, calculé mois par mois sur la législature en cours.",
        dataShape: "timeseries",
        unit: "%",
    }),
    defineStat("scrutins", "total", {
        scope: "aggregate",
        title: "Nombre de scrutins",
        category: "Volume",
        keywords: ["scrutins", "total", "nombre", "volume"],
        description: "Le nombre total de scrutins (votes solennels/publics organisés) sur la législature — pas le nombre de votes individuels des député·es.",
        methodology: "Comptage des scrutins enregistrés pour la législature sélectionnée.",
        dataShape: "scalar",
        unit: "scrutins",
    }),
];
