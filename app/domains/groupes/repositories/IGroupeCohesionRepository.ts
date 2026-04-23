import {GroupeCohesionRow} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

export interface IGroupeCohesionRepository {
    getGroupeCohesion(code: string, legislature: number): Promise<GroupeCohesionRow[]>;
}