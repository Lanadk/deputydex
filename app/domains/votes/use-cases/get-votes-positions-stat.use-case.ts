import { IVotesStatsRepository } from "@/app/domains/votes/repositories/IVotesStatsRepository";
import { mapVotePositionsStatToDTO } from "@/app/domains/votes/mappers/vote-positions-stat.mapper";
import { VotePositionsStatDTO } from "@/app/domains/votes/dto/vote-positions-stat.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getVotesPositionsStatUseCase(
    repository: IVotesStatsRepository,
    legislature?: number
): Promise<Result<VotePositionsStatDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getPositionsTotals(legislature));
    if (isErr(result)) return result;
    const totals = result.data;

    return ok(mapVotePositionsStatToDTO(totals));
}
