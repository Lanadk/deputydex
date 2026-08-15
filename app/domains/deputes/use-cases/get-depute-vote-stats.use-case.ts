import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeVoteStatsRepository } from "@/app/domains/deputes/repositories/IDeputeVoteStatsRepository";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";
import { mapDeputeVoteStatsEntityToDTO } from "@/app/domains/deputes/mappers/depute-vote-stats.mapper";

export async function getDeputeVoteStatsUseCase(
    repository: IDeputeVoteStatsRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeVoteStatsDTO, "NOT_FOUND" | "ERROR">> {
    try {
        const entity = await repository.getDeputeVoteStats(uid, legislature);
        if (!entity) return err("NOT_FOUND");
        return ok(mapDeputeVoteStatsEntityToDTO(entity));
    } catch {
        return err("ERROR");
    }
}
