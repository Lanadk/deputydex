import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {IGroupeActivityDetailsRepository} from "@/app/domains/groupes/repositories/IGroupeActivityDetailsRepository";
import {GroupeActivityDetailsDTO} from "@/app/domains/groupes/dto/groupe-activity-details.dto";
import {mapEntityToGroupeActivityDetailsDTO} from "@/app/domains/groupes/mappers/groupe-activity-details.mapper";


export async function getGroupeActivityDetailsUseCase(
    repository: IGroupeActivityDetailsRepository,
    groupeCode: string,
    legislature: number,
    date: any
): Promise<Result<GroupeActivityDetailsDTO[], "ERROR">> {

    const entities = await repository.getGroupeActivityDetails(groupeCode, legislature, date);

    if (!entities) {
        return err("ERROR")
    }

    const dtos = mapEntityToGroupeActivityDetailsDTO(entities);
    return ok(dtos);
}