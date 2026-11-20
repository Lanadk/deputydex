import { Result, ok, err, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeVoteStatsRepository } from "@/app/domains/deputes/repositories/IDeputeVoteStatsRepository";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";
import { mapDeputeVoteStatsEntityToDTO } from "@/app/domains/deputes/mappers/depute-vote-stats.mapper";

export async function getDeputeVoteStatsUseCase(
    repository: IDeputeVoteStatsRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeVoteStatsDTO, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeVoteStats(uid, legislature));
    if (isErr(result)) return result;
    const entity = result.data;

    if (!entity) return err("NOT_FOUND");
    return ok(mapDeputeVoteStatsEntityToDTO(entity));
}
