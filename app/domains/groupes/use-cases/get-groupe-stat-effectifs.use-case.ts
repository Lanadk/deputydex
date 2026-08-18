import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatEffectifsToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatEffectifsDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatEffectifsUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatEffectifsDTO, never>> {
    const rows = await repository.getEffectifs(legislature);
    return ok(mapGroupeStatEffectifsToDTO(rows));
}
