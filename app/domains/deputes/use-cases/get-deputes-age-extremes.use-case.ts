import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputesAgeRepository } from "@/app/domains/deputes/repositories/IDeputesAgeRepository";
import { DeputesAgeExtremesDTO } from "@/app/domains/deputes/dto/deputes-age-extremes.dto";
import { mapEntitiesToDeputesAgeExtremesDTO } from "@/app/domains/deputes/mappers/deputes-age-extremes.mapper";

export async function getDeputesAgeExtremesUseCase(
    repository: IDeputesAgeRepository,
    legislature: number
): Promise<Result<DeputesAgeExtremesDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getAgeExtremes(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapEntitiesToDeputesAgeExtremesDTO(rows));
}
