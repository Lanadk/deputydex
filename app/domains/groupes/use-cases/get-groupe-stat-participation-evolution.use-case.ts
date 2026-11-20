import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatParticipationEvolutionToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatParticipationEvolutionDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatParticipationEvolutionUseCase(
    repository: IGroupesStatsRepository,
    code: string,
    legislature: number
): Promise<Result<GroupeStatParticipationEvolutionDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getParticipationEvolutionParGroupe(code, legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatParticipationEvolutionToDTO(rows));
}
