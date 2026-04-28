import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeAmendementStatsRepository } from "@/app/domains/deputes/repositories/IDeputeAmendementStatsRepository";
import { DeputeAmendementStatsDTO } from "@/app/domains/deputes/dto/depute-amendement-stats.dto";
import { mapDeputeAmendementStatsEntityToDTO } from "@/app/domains/deputes/mappers/depute-amendement-stats.mapper";

export async function getDeputeAmendementStatsUseCase(
    repository: IDeputeAmendementStatsRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeAmendementStatsDTO, "NOT_FOUND" | "ERROR">> {
    try {
        const entity = await repository.getDeputeAmendementStats(uid, legislature);
        if (!entity) return err("NOT_FOUND");
        return ok(mapDeputeAmendementStatsEntityToDTO(entity));
    } catch {
        return err("ERROR");
    }
}
