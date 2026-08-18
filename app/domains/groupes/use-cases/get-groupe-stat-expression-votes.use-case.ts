import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatExpressionVotesToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatExpressionVotesDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatExpressionVotesUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatExpressionVotesDTO, never>> {
    const rows = await repository.getExpressionVotesParGroupe(legislature);
    return ok(mapGroupeStatExpressionVotesToDTO(rows));
}
