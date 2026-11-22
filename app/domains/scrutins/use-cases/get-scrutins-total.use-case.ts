import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";
import { ScrutinsTotalDTO } from "@/app/domains/scrutins/dto/scrutins-total.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getScrutinsTotalUseCase(
    repository: IScrutinsStatsRepository,
    legislature?: number
): Promise<Result<ScrutinsTotalDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.countScrutins(legislature));
    if (isErr(result)) return result;
    const total = result.data;

    return ok({ total });
}
