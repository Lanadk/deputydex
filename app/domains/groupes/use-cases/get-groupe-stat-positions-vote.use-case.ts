import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatPositionsVoteToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatPositionsVoteDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatPositionsVoteUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatPositionsVoteDTO, never>> {
    const rows = await repository.getPositionsVoteParGroupe(legislature);
    return ok(mapGroupeStatPositionsVoteToDTO(rows));
}
