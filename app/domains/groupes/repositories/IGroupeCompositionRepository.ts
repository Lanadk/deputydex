import {
    ProfessionCategorieRow,
    ProfessionFamilleRow
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-composition.repository";

export interface IGroupeCompositionRepository {
    getGroupeComposition(code: string, legislature: number): Promise<any>;
    getProfessionFamilles(code: string, legislature: number): Promise<ProfessionFamilleRow[]>;
    getProfessionCategories(code: string, legislature: number): Promise<ProfessionCategorieRow[]>;
}