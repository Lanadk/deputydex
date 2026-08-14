import {GroupeLegislatureEntity} from "@/app/domains/groupes/entities/groupe-legislatures.entity";

export interface IGroupeLegislaturesRepository {
    getGroupeLegislatures(code: string): Promise<GroupeLegislatureEntity[]>;
}
