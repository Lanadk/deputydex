import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurGenderDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-gender-distribution.mapper";
import { ActeurGenderDistributionDTO } from "@/app/domains/acteurs/dto/acteur-gender-distribution.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getActeursGenderDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature?: number
): Promise<Result<ActeurGenderDistributionDTO, never>> {
    const entities = await repository.getGenderDistribution(legislature);
    return ok(mapActeurGenderDistributionToDTO(entities));
}
