import {GroupeCompositionEntity} from "@/app/domains/groupes/entities/groupe-composition.entity";

export interface IGroupeCompositionRepository {
    getGroupeComposition(code: string, legislature: number): Promise<GroupeCompositionEntity | null>;
}