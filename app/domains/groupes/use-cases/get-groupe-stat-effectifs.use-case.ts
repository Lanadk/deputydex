import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatEffectifsToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatEffectifsDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatEffectifsUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatEffectifsDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getEffectifs(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatEffectifsToDTO(rows));
}
