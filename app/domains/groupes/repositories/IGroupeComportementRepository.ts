import {GroupeComportementEntity} from "@/app/domains/groupes/entities/groupe-comportement.entity";

export interface IGroupeComportementRepository {
    getGroupeComportementLegislature(code: string, legislature: number): Promise<GroupeComportementEntity>;
}