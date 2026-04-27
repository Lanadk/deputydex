import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {IGroupeActivityRepository} from "@/app/domains/groupes/repositories/IGroupeActivityRepository";
import {mapEntityToGroupeActivityDTO} from "@/app/domains/groupes/mappers/groupe-activity.mapper";


export async function getGroupesActivityUseCase(
    repository: IGroupeActivityRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<any, "ERROR">> {

    const entities = await repository.getGroupeActivity(groupeCode, legislature);

    if (!entities) {
        return err("ERROR")
    }

    const dto = mapEntityToGroupeActivityDTO(entities);
    return ok(dto);
}