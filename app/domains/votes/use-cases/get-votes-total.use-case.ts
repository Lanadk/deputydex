import { IVotesStatsRepository } from "@/app/domains/votes/repositories/IVotesStatsRepository";
import { VotesTotalDTO } from "@/app/domains/votes/dto/votes-total.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getVotesTotalUseCase(
    repository: IVotesStatsRepository,
    legislature?: number
): Promise<Result<VotesTotalDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.countVotes(legislature));
    if (isErr(result)) return result;
    const total = result.data;

    return ok({ total });
}
