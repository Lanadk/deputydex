import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurAgeDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-age-distribution.mapper";
import { ActeurAgeDistributionDTO } from "@/app/domains/acteurs/dto/acteur-age-distribution.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getActeursAgeDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature?: number
): Promise<Result<ActeurAgeDistributionDTO, never>> {
    const entities = await repository.getAgeDistribution(legislature);

    return ok(mapActeurAgeDistributionToDTO(entities));
}
