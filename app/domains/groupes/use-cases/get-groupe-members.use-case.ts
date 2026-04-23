import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {IGroupeMembersRepository} from "@/app/domains/groupes/repositories/IGroupeMembersRepository";
import {mapEntityToGroupeMembersDTO} from "@/app/domains/groupes/mappers/groupe-members.mapper";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";


export async function getGroupeMembersUseCase(
    repository: IGroupeMembersRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeMembersDTO[], "ERROR">> {

    const entities = await repository.getGroupeMembers(groupeCode, legislature);

    if (!entities) {
        return err("ERROR")
    }

    const dtos = mapEntityToGroupeMembersDTO(entities);
    return ok(dtos);
}