import { DeputeAgeRow } from "@/app/domains/deputes/entities/depute-age.entity";

export interface IDeputesAgeRepository {
    /**
     * Le·la député·e le/la plus jeune et le/la plus expérimenté·e (âgé·e) de
     * la législature — au plus 2 lignes (1 seule si un seul député a un âge
     * connu cette législature). Source : `agg_deputes_stats_age`.
     */
    getAgeExtremes(legislature: number): Promise<DeputeAgeRow[]>;
}
