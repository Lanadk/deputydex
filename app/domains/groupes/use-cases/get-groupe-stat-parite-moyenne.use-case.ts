import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatPariteToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatPariteDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatPariteMoyenneUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatPariteDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getPariteMoyenne(legislature));
    if (isErr(result)) return result;
    const entity = result.data;

    return ok(mapGroupeStatPariteToDTO(entity));
}
