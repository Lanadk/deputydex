import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurProfessionDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-profession-distribution.mapper";
import { ActeurProfessionDistributionDTO } from "@/app/domains/acteurs/dto/acteur-profession-distribution.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getActeursProfessionDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature: number
): Promise<Result<ActeurProfessionDistributionDTO, never>> {
    const entities = await repository.getProfessionDistribution(legislature);
    return ok(mapActeurProfessionDistributionToDTO(entities));
}
