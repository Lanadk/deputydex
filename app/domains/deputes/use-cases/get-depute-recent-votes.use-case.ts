import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeRecentVotesRepository } from "@/app/domains/deputes/repositories/IDeputeRecentVotesRepository";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { mapDeputeRecentVotesEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-recent-vote.mapper";

export async function getDeputeRecentVotesUseCase(
    repository: IDeputeRecentVotesRepository,
    uid: string,
    legislature: number,
    limit = 20
): Promise<Result<DeputeRecentVoteDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputeRecentVotes(uid, legislature, limit);
        return ok(mapDeputeRecentVotesEntitiesToDTOs(entities));
    } catch {
        return err("ERROR");
    }
}
