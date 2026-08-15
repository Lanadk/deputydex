import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCohesionToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCohesionDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatCohesionUseCase(
    repository: IGroupesStatsRepository,
    code: string,
    legislature: number
): Promise<Result<GroupeStatCohesionDTO, never>> {
    const rows = await repository.getCohesionEvolution(code, legislature);
    return ok(mapGroupeStatCohesionToDTO(rows));
}
