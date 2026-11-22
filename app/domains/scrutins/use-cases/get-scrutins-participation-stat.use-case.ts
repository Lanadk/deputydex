import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";
import { mapScrutinParticipationStatToDTO } from "@/app/domains/scrutins/mappers/scrutin-participation-stat.mapper";
import { ScrutinParticipationStatDTO } from "@/app/domains/scrutins/dto/scrutin-participation-stat.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getScrutinsParticipationStatUseCase(
    repository: IScrutinsStatsRepository
): Promise<Result<ScrutinParticipationStatDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getParticipationEvolution());
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapScrutinParticipationStatToDTO(rows));
}
