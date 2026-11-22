import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeurProfessionDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-profession-distribution.mapper";
import { ActeurProfessionDistributionDTO } from "@/app/domains/acteurs/dto/acteur-profession-distribution.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getActeursProfessionDistributionUseCase(
    repository: IActeursStatsRepository,
    legislature: number
): Promise<Result<ActeurProfessionDistributionDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getProfessionDistribution(legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapActeurProfessionDistributionToDTO(entities));
}
