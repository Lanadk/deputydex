import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCumulMandatsToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCumulMandatsDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatCumulMandatsUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatCumulMandatsDTO, never>> {
    const rows = await repository.getCumulMandatsParGroupe(legislature);
    return ok(mapGroupeStatCumulMandatsToDTO(rows));
}
