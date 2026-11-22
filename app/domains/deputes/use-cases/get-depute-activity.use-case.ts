import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeActivityRepository } from "@/app/domains/deputes/repositories/IDeputeActivityRepository";
import { DeputeActivityDTO } from "@/app/domains/deputes/dto/depute-activity.dto";
import { mapEntityToDeputeActivityDTO } from "@/app/domains/deputes/mappers/depute-activity.mapper";

export async function getDeputeActivityUseCase(
    repository: IDeputeActivityRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeActivityDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeActivity(uid, legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapEntityToDeputeActivityDTO(entities));
}
