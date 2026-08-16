import { IVotesStatsRepository } from "@/app/domains/votes/repositories/IVotesStatsRepository";
import { VotesTotalDTO } from "@/app/domains/votes/dto/votes-total.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getVotesTotalUseCase(
    repository: IVotesStatsRepository,
    legislature: number
): Promise<Result<VotesTotalDTO, never>> {
    const total = await repository.countVotes(legislature);
    return ok({ total });
}
