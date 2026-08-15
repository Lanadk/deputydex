import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { mapActeursToDTO } from "@/app/domains/acteurs/mappers/acteur.mapper";
import { ActeurDTO } from "@/app/domains/acteurs/dto/acteur.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function searchDeputiesUseCase(
    repository: IActeursStatsRepository,
    search?: string
): Promise<Result<ActeurDTO[], never>> {
    const entities = await repository.searchDeputies(search);
    return ok(mapActeursToDTO(entities));
}
