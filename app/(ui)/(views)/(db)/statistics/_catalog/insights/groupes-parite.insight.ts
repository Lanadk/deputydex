import { InsightResolver } from "@/app/(ui)/(views)/(db)/statistics/_catalog/insight.types";
import { describeDirection, formatPct, ratioPct } from "@/app/(ui)/(views)/(db)/statistics/_catalog/insights/phrase-helpers";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

function pctFemmes(items: { label: string; value: number }[]): number | null {
    const hommes = items.find((i) => i.label === "Hommes")?.value;
    const femmes = items.find((i) => i.label === "Femmes")?.value;
    if (hommes == null || femmes == null) return null;
    return ratioPct(femmes, hommes);
}

function distributionPct(data: RawStatData | null): number | null {
    return data?.shape === "distribution" ? pctFemmes(data.items) : null;
}

/**
 * "RN a un taux de femmes de 46%, au-dessus de la législature précédente
 * (44%) et au-dessus de la moyenne des groupes (35%)."
 *
 * Aucun insight si : scope aggregate (pas d'entité précise à commenter), ou
 * aucune des deux comparaisons n'est calculable (ex: législature 15, pas de
 * "précédente" possible, et l'appel moyenne échoue) — jamais de phrase à
 * moitié vide.
 */
export const groupesPariteInsight: InsightResolver = async (definition, context, current) => {
    if (current.shape !== "distribution") return null;

    const entityId = context.entityId;
    const legislature = context.filters?.legislature as number | undefined;
    if (!entityId || !legislature) return null;

    const currentPct = pctFemmes(current.items);
    if (currentPct == null) return null;

    const entityLabel = (context.filters?.entityLabel as string | undefined) ?? entityId;

    const [previousData, moyenneData] = await Promise.all([
        legislature > 1
            ? statisticsGateway
                  .fetchStat("groupes", "parite", { entityId, filters: { legislature: legislature - 1 } })
                  .catch(() => null)
            : Promise.resolve(null),
        statisticsGateway.fetchStat("groupes", "parite-moyenne", { filters: { legislature } }).catch(() => null),
    ]);

    const clauses: string[] = [`${entityLabel} a un taux de femmes de ${formatPct(currentPct)}`];

    const previousPct = distributionPct(previousData);
    if (previousPct != null) {
        clauses.push(
            `c'est ${describeDirection(currentPct, previousPct)} la législature précédente, qui était de ${formatPct(previousPct)}`
        );
    }

    const moyennePct = distributionPct(moyenneData);
    if (moyennePct != null) {
        clauses.push(
            `c'est ${describeDirection(currentPct, moyennePct)} la moyenne des groupes, qui est de ${formatPct(moyennePct)}`
        );
    }

    // Que la valeur courante, sans aucune comparaison réussie : pas assez
    // intéressant pour justifier un encart de texte.
    if (clauses.length === 1) return null;

    return `${clauses.join(", ")}.`;
};
