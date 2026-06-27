import { err, ok, Result } from "@/app/_shared/result-pattern/result";
import { IDeputeActivityDetailsRepository } from "@/app/domains/deputes/repositories/IDeputeActivityDetailsRepository";
import { DeputeActivityDetailsDTO } from "@/app/domains/deputes/dto/depute-activity-details.dto";
import { mapEntityToDeputeActivityDetailsDTO } from "@/app/domains/deputes/mappers/depute-activity-details.mapper";

export async function getDeputeActivityDetailsUseCase(
    repository: IDeputeActivityDetailsRepository,
    uid: string,
    legislature: number,
    date: Date
): Promise<Result<DeputeActivityDetailsDTO[], "ERROR">> {
    const entities = await repository.getDeputeActivityDetails(uid, legislature, date);

    if (!entities) {
        return err("ERROR");
    }

    return ok(mapEntityToDeputeActivityDetailsDTO(entities));
}
