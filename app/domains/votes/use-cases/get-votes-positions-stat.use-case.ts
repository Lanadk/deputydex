import { IVotesStatsRepository } from "@/app/domains/votes/repositories/IVotesStatsRepository";
import { mapVotePositionsStatToDTO } from "@/app/domains/votes/mappers/vote-positions-stat.mapper";
import { VotePositionsStatDTO } from "@/app/domains/votes/dto/vote-positions-stat.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getVotesPositionsStatUseCase(
    repository: IVotesStatsRepository
): Promise<Result<VotePositionsStatDTO, never>> {
    const totals = await repository.getPositionsTotals();
    return ok(mapVotePositionsStatToDTO(totals));
}
