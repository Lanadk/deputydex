import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";
import { mapScrutinParticipationStatToDTO } from "@/app/domains/scrutins/mappers/scrutin-participation-stat.mapper";
import { ScrutinParticipationStatDTO } from "@/app/domains/scrutins/dto/scrutin-participation-stat.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getScrutinsParticipationStatUseCase(
    repository: IScrutinsStatsRepository
): Promise<Result<ScrutinParticipationStatDTO, never>> {
    const rows = await repository.getParticipationEvolution();
    return ok(mapScrutinParticipationStatToDTO(rows));
}
