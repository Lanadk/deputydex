import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatPositionsVoteToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatPositionsVoteDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatPositionsVoteUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatPositionsVoteDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getPositionsVoteParGroupe(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatPositionsVoteToDTO(rows));
}
