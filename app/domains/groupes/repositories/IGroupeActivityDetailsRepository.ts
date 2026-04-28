import {GroupeActivityDetailsEntity} from "@/app/domains/groupes/entities/groupe-activity-details.entity";

export interface IGroupeActivityDetailsRepository {
    getGroupeActivityDetails(code: string, legislature: number, date: any): Promise<GroupeActivityDetailsEntity[]>;
}