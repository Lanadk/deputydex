import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCohesionEvolutionTousToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCohesionEvolutionTousDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatCohesionEvolutionTousUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatCohesionEvolutionTousDTO, never>> {
    const rows = await repository.getCohesionEvolutionTousGroupes(legislature);
    return ok(mapGroupeStatCohesionEvolutionTousToDTO(rows));
}
