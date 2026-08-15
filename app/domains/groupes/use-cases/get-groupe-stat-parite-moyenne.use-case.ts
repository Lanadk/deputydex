import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatPariteToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatPariteDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getGroupeStatPariteMoyenneUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatPariteDTO, never>> {
    const entity = await repository.getPariteMoyenne(legislature);
    return ok(mapGroupeStatPariteToDTO(entity));
}
