import {IGroupeInfosRepository} from "@/app/domains/groupes/repositories/IGroupeInfosRepository";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {mapEntityToGroupeInfosDTO} from "@/app/domains/groupes/mappers/groupe-infos.mapper";


export async function getGroupeInfosUseCase(
    repository: IGroupeInfosRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<GroupeInfosDTO, "ERROR">> {

    const entities = await repository.getGroupeInfos(groupeCode, legislature);

    if (!entities) {
        return err("ERROR")
    }

    const dtos = mapEntityToGroupeInfosDTO(legislature, entities);
    return ok(dtos);
}