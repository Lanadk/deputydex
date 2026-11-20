import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupeMembersRepository} from "@/app/domains/groupes/repositories/IGroupeMembersRepository";
import {mapEntityToGroupeMembersDTO} from "@/app/domains/groupes/mappers/groupe-members.mapper";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";


export async function getGroupeMembersUseCase(
    repository: IGroupeMembersRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeMembersDTO[], "DB_ERROR">> {

    const read = await fromRepository(() => repository.getGroupeMembers(groupeCode, legislature));
    if (isErr(read)) return read;

    return ok(mapEntityToGroupeMembersDTO(read.data));
}
