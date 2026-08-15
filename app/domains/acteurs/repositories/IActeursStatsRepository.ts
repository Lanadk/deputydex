import { AgeDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-age-distribution.entity";

export interface IActeursStatsRepository {
    /**
     * Répartition de TOUS les députés par tranche d'âge.
     * TODO: accepter des filtres (legislature, groupeCode...) pour couvrir
     * les futures stats "aggregate" filtrées — cette première implémentation
     * couvre le cas non filtré ("tous les députés depuis toujours").
     */
    getAgeDistribution(): Promise<AgeDistributionBucketEntity[]>;
}
