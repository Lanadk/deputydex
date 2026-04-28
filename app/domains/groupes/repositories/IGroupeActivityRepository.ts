import {GroupeActivityEntity} from "@/app/domains/groupes/entities/groupe-activity.entity";

export interface IGroupeActivityRepository {
    getGroupeActivity(code: string, legislature: number): Promise<GroupeActivityEntity[]>;
}