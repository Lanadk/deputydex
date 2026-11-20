import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatExpressionVotesToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatExpressionVotesDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatExpressionVotesUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatExpressionVotesDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getExpressionVotesParGroupe(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatExpressionVotesToDTO(rows));
}
