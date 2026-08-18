import { ok, Result } from "@/app/_shared/result-pattern/result";
import { IDeputesAgeRepository } from "@/app/domains/deputes/repositories/IDeputesAgeRepository";
import { DeputesAgeExtremesDTO } from "@/app/domains/deputes/dto/deputes-age-extremes.dto";
import { mapEntitiesToDeputesAgeExtremesDTO } from "@/app/domains/deputes/mappers/deputes-age-extremes.mapper";

export async function getDeputesAgeExtremesUseCase(
    repository: IDeputesAgeRepository,
    legislature: number
): Promise<Result<DeputesAgeExtremesDTO, never>> {
    const rows = await repository.getAgeExtremes(legislature);

    return ok(mapEntitiesToDeputesAgeExtremesDTO(rows));
}
