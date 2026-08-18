import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatParticipationEvolutionToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatParticipationEvolutionDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatParticipationEvolutionUseCase(
    repository: IGroupesStatsRepository,
    code: string,
    legislature: number
): Promise<Result<GroupeStatParticipationEvolutionDTO, never>> {
    const rows = await repository.getParticipationEvolutionParGroupe(code, legislature);
    return ok(mapGroupeStatParticipationEvolutionToDTO(rows));
}
