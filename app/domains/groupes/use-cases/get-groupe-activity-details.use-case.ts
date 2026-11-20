import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupeActivityDetailsRepository} from "@/app/domains/groupes/repositories/IGroupeActivityDetailsRepository";
import {GroupeActivityDetailsDTO} from "@/app/domains/groupes/dto/groupe-activity-details.dto";
import {mapEntityToGroupeActivityDetailsDTO} from "@/app/domains/groupes/mappers/groupe-activity-details.mapper";


export async function getGroupeActivityDetailsUseCase(
    repository: IGroupeActivityDetailsRepository,
    groupeCode: string,
    legislature: number,
    date: any
): Promise<Result<GroupeActivityDetailsDTO[], "DB_ERROR">> {

    const read = await fromRepository(() => repository.getGroupeActivityDetails(groupeCode, legislature, date));
    if (isErr(read)) return read;

    return ok(mapEntityToGroupeActivityDetailsDTO(read.data, legislature));
}
