import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeListToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeListDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupesListUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeListDTO, never>> {
    const rows = await repository.listGroupesLegislature(legislature);
    return ok(mapGroupeListToDTO(rows));
}
