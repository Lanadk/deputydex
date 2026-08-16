import { ok, Result } from "@/app/_shared/result-pattern/result";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { GroupesAgeDTO } from "@/app/domains/groupes/dto/groupes-age.dto";
import { mapEntitiesToGroupesAgeDTO } from "@/app/domains/groupes/mappers/groupes-age.mapper";

export async function getGroupesAgeUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupesAgeDTO, never>> {
    const rows = await repository.getAgeParGroupe(legislature);

    return ok(mapEntitiesToGroupesAgeDTO(rows));
}
