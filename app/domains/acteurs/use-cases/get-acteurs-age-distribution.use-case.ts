import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurAgeDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-age-distribution.mapper";
import { ActeurAgeDistributionDTO } from "@/app/domains/acteurs/dto/acteur-age-distribution.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getActeursAgeDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature?: number
): Promise<Result<ActeurAgeDistributionDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getAgeDistribution(legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapActeurAgeDistributionToDTO(entities));
}
