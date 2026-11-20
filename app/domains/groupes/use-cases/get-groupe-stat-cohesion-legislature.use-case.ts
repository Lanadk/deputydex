import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCohesionLegislatureToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCohesionLegislatureDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatCohesionLegislatureUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatCohesionLegislatureDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getCohesionParGroupe(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatCohesionLegislatureToDTO(rows));
}
