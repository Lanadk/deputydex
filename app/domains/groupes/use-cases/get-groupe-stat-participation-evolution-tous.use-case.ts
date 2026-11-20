import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatParticipationEvolutionTousToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatParticipationEvolutionTousDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatParticipationEvolutionTousUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatParticipationEvolutionTousDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getParticipationEvolutionTousGroupes(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatParticipationEvolutionTousToDTO(rows));
}
