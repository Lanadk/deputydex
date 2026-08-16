import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatParticipationEvolutionTousToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatParticipationEvolutionTousDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatParticipationEvolutionTousUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatParticipationEvolutionTousDTO, never>> {
    const rows = await repository.getParticipationEvolutionTousGroupes(legislature);
    return ok(mapGroupeStatParticipationEvolutionTousToDTO(rows));
}
