import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";
import { ScrutinsTotalDTO } from "@/app/domains/scrutins/dto/scrutins-total.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getScrutinsTotalUseCase(
    repository: IScrutinsStatsRepository,
    legislature: number
): Promise<Result<ScrutinsTotalDTO, never>> {
    const total = await repository.countScrutins(legislature);
    return ok({ total });
}
