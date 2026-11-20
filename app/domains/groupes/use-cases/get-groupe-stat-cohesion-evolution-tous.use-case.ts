import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCohesionEvolutionTousToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCohesionEvolutionTousDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatCohesionEvolutionTousUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatCohesionEvolutionTousDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getCohesionEvolutionTousGroupes(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatCohesionEvolutionTousToDTO(rows));
}
