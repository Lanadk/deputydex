import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeRecentVotesRepository } from "@/app/domains/deputes/repositories/IDeputeRecentVotesRepository";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { mapDeputeRecentVotesEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-recent-vote.mapper";

export async function getDeputeRecentVotesUseCase(
    repository: IDeputeRecentVotesRepository,
    uid: string,
    legislature: number,
    limit = 20
): Promise<Result<DeputeRecentVoteDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeRecentVotes(uid, legislature, limit));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapDeputeRecentVotesEntitiesToDTOs(entities, legislature));
}
