import {GroupeMembersEntity} from "@/app/domains/groupes/entities/groupe-members.entity";

export interface IGroupeMembersRepository {
    getGroupeMembers(code: string, legislature: number): Promise<GroupeMembersEntity[]>;
}