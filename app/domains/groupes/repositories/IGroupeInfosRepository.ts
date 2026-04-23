import {GroupeInfosEntity} from "@/app/domains/groupes/entities/groupe-infos.entity";

export interface IGroupeInfosRepository {
    getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosEntity[]>;
}