import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";

/**
 * Fetch générique, identique pour toutes les stats du catalogue : chaque
 * StatDefinition est un pur descripteur (voir stat-definition.types.ts),
 * jamais une fonction. Seul ce point d'entrée sait taper le réseau.
 */
export function fetchStatData(definition: StatDefinition, params: StatFetchParams = {}): Promise<RawStatData> {
    return statisticsGateway.fetchStat(definition.domain, definition.slug, params);
}
