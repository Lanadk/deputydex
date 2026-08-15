import { AgeDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-age-distribution.entity";
import { GenderDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-gender-distribution.entity";
import { ActeurEntity } from "@/app/domains/acteurs/entities/acteurs.entity";

export interface IActeursStatsRepository {
    /**
     * Députés ayant réellement eu un mandat (EXISTS mandats), toutes
     * législatures confondues — un député reste le même quelle que soit la
     * législature, pas de filtre ici. `search` filtre sur le nom, insensible
     * à la casse.
     */
    searchDeputies(search?: string): Promise<ActeurEntity[]>;

    /**
     * Répartition des députés par tranche d'âge. `legislature` restreint aux
     * députés ayant eu un mandat durant cette législature ; omis = tous les
     * députés recensés, toutes législatures confondues.
     */
    getAgeDistribution(legislature?: number): Promise<AgeDistributionBucketEntity[]>;

    /** Même principe que getAgeDistribution, réparti par civilité déclarée. */
    getGenderDistribution(legislature?: number): Promise<GenderDistributionBucketEntity[]>;

    /** Nombre de mandats de député détenus par cet acteur, toutes législatures confondues. */
    getMandatsCount(acteurUid: string): Promise<number>;
}
