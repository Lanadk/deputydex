import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeActivityDetailsRepository } from "@/app/domains/deputes/repositories/IDeputeActivityDetailsRepository";
import { DeputeActivityDetailsDTO } from "@/app/domains/deputes/dto/depute-activity-details.dto";
import { mapEntityToDeputeActivityDetailsDTO } from "@/app/domains/deputes/mappers/depute-activity-details.mapper";

export async function getDeputeActivityDetailsUseCase(
    repository: IDeputeActivityDetailsRepository,
    uid: string,
    legislature: number,
    date: Date
): Promise<Result<DeputeActivityDetailsDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeActivityDetails(uid, legislature, date));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapEntityToDeputeActivityDetailsDTO(entities, legislature));
}
