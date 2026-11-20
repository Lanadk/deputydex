import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurGenderDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-gender-distribution.mapper";
import { ActeurGenderDistributionDTO } from "@/app/domains/acteurs/dto/acteur-gender-distribution.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getActeursGenderDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature?: number
): Promise<Result<ActeurGenderDistributionDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getGenderDistribution(legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapActeurGenderDistributionToDTO(entities));
}
