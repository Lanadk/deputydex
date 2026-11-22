import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { mapGroupeStatCumulMandatsToDTO } from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";
import { GroupeStatCumulMandatsDTO } from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getGroupeStatCumulMandatsUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupeStatCumulMandatsDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getCumulMandatsParGroupe(legislature));
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapGroupeStatCumulMandatsToDTO(rows));
}
