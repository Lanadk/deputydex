import {GroupeMembersRow} from "@/app/infrastructure/groupes/repositories/prisma-groupe-members.repository";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";

export function mapEntityToGroupeMembersDTO(entities: GroupeMembersRow[]): GroupeMembersDTO[] {
    return entities.map((entity) => ({
        deputyFirstName: entity.first_name,
        deputyLastName: entity.last_name,
        since: entity.since,
        circonscription: entity.circonscription,
        age: entity.age,
    }));
}