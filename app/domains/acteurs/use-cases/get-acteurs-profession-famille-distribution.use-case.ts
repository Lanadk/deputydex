import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurProfessionFamilleDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-profession-distribution.mapper";
import { ActeurProfessionDistributionDTO } from "@/app/domains/acteurs/dto/acteur-profession-distribution.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getActeursProfessionFamilleDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature: number
): Promise<Result<ActeurProfessionDistributionDTO, never>> {
    const entities = await repository.getProfessionFamilleDistribution(legislature);
    return ok(mapActeurProfessionFamilleDistributionToDTO(entities));
}
