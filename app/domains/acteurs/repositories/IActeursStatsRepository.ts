import { AgeDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-age-distribution.entity";
import { GenderDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-gender-distribution.entity";
import { ProfessionDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-profession-distribution.entity";
import { ProfessionFamilleDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-profession-famille-distribution.entity";
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

    /**
     * Répartition des député·es par catégorie socio-professionnelle INSEE,
     * pour une législature donnée (mandats `type_organe = 'ASSEMBLEE'`
     * uniquement — pas les mandats de groupe). Contrairement à
     * `getAgeDistribution`/`getGenderDistribution`, `legislature` n'est PAS
     * optionnel ici : la vue source est nativement par-législature, sommer
     * "toutes législatures confondues" n'a pas de sens univoque (un·e
     * député·e réélu·e y compterait plusieurs fois).
     */
    getProfessionDistribution(legislature: number): Promise<ProfessionDistributionBucketEntity[]>;

    /**
     * Même principe que `getProfessionDistribution`, mais regroupé par
     * `profession_famille` — la nomenclature "famille" (~8 grandes
     * familles : Agriculteurs, Ouvriers, Cadres...) est celle qui se
     * rapproche des catégories socioprofessionnelles publiées par l'INSEE
     * pour la population générale, contrairement à `profession_categorie`
     * (nomenclature fine propre à l'Assemblée, ~25 libellés) — utilisée pour
     * la comparaison Assemblée / population française.
     */
    getProfessionFamilleDistribution(legislature: number): Promise<ProfessionFamilleDistributionBucketEntity[]>;
}
