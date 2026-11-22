import { Result, ok, err, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeAmendementStatsRepository } from "@/app/domains/deputes/repositories/IDeputeAmendementStatsRepository";
import { DeputeAmendementStatsDTO } from "@/app/domains/deputes/dto/depute-amendement-stats.dto";
import { mapDeputeAmendementStatsEntityToDTO } from "@/app/domains/deputes/mappers/depute-amendement-stats.mapper";

export async function getDeputeAmendementStatsUseCase(
    repository: IDeputeAmendementStatsRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeAmendementStatsDTO, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeAmendementStats(uid, legislature));
    if (isErr(result)) return result;
    const entity = result.data;

    if (!entity) return err("NOT_FOUND");
    return ok(mapDeputeAmendementStatsEntityToDTO(entity));
}
