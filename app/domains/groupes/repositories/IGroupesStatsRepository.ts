import {
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatPariteEntity,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

export interface IGroupesStatsRepository {
    getParite(code: string, legislature: number): Promise<GroupeStatPariteEntity>;

    getEffectifs(legislature: number): Promise<GroupeStatEffectifRow[]>;

    getCohesionEvolution(code: string, legislature: number): Promise<GroupeStatCohesionPointEntity[]>;
}
