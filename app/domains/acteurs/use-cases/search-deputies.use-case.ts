import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeursToDTO } from "@/app/domains/acteurs/mappers/acteur.mapper";
import { ActeurDTO } from "@/app/domains/acteurs/dto/acteur.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function searchDeputiesUseCase(
    repository: IActeursStatsRepository,
    search?: string
): Promise<Result<ActeurDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.searchDeputies(search));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapActeursToDTO(entities));
}
