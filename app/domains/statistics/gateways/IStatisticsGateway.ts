import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { StatDomain, StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";

/**
 * Contrat client unique pour TOUTES les stats du catalogue, quel que soit le
 * domaine — contrairement aux gateways par domaine (IGroupesGateways...) qui
 * exposent une méthode par ressource, ici une seule méthode générique suffit
 * puisque chaque StatDefinition est un pur descripteur (voir
 * app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types.ts).
 */
export interface IStatisticsGateway {
    fetchStat(domain: StatDomain, slug: string, params: StatFetchParams): Promise<RawStatData>;
}
