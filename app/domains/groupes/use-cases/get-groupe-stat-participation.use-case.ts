import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatParticipationToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatParticipationDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatParticipationUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatParticipationDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getParticipationParGroupe(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatParticipationToDTO(rows));
}
