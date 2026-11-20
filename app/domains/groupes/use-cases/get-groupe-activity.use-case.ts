import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IGroupeActivityRepository} from "@/app/domains/groupes/repositories/IGroupeActivityRepository";
import {mapEntityToGroupeActivityDTO} from "@/app/domains/groupes/mappers/groupe-activity.mapper";


export async function getGroupeActivityUseCase(
    repository: IGroupeActivityRepository,
    groupeCode: string,
    legislature: number
): Promise<Result<any, "DB_ERROR">> {

    const result = await fromRepository(() => repository.getGroupeActivity(groupeCode, legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    const dto = mapEntityToGroupeActivityDTO(entities);
    return ok(dto);
}
