import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCohesionLegislatureToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCohesionLegislatureDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatCohesionLegislatureUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatCohesionLegislatureDTO, never>> {
    const rows = await repository.getCohesionParGroupe(legislature);
    return ok(mapGroupeStatCohesionLegislatureToDTO(rows));
}
