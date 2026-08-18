import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatParticipationToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatParticipationDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatParticipationUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatParticipationDTO, never>> {
    const rows = await repository.getParticipationParGroupe(legislature);
    return ok(mapGroupeStatParticipationToDTO(rows));
}
