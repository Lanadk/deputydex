import {GroupeCohesionEntity} from "@/app/domains/groupes/entities/groupe-cohesion.entity";

export interface IGroupeCohesionRepository {
    getGroupeCohesionLegislature(code: string, legislature: number): Promise<GroupeCohesionEntity>;
}