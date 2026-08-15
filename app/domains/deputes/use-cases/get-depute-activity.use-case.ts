import { err, ok, Result } from "@/app/_shared/result-pattern/result";
import { IDeputeActivityRepository } from "@/app/domains/deputes/repositories/IDeputeActivityRepository";
import { DeputeActivityDTO } from "@/app/domains/deputes/dto/depute-activity.dto";
import { mapEntityToDeputeActivityDTO } from "@/app/domains/deputes/mappers/depute-activity.mapper";

export async function getDeputeActivityUseCase(
    repository: IDeputeActivityRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeActivityDTO, "ERROR">> {
    const entities = await repository.getDeputeActivity(uid, legislature);

    if (!entities) {
        return err("ERROR");
    }

    return ok(mapEntityToDeputeActivityDTO(entities));
}
