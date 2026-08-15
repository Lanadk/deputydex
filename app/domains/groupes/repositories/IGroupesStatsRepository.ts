import {
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatPariteEntity,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

export interface IGroupesStatsRepository {
    getParite(code: string, legislature: number): Promise<GroupeStatPariteEntity>;

    /** Parité hommes/femmes agrégée sur TOUS les groupes d'une législature (la "moyenne" du domaine) — utilisé par les insights, pas exposé comme stat du catalogue. */
    getPariteMoyenne(legislature: number): Promise<GroupeStatPariteEntity>;

    getEffectifs(legislature: number): Promise<GroupeStatEffectifRow[]>;

    getCohesionEvolution(code: string, legislature: number): Promise<GroupeStatCohesionPointEntity[]>;
}
