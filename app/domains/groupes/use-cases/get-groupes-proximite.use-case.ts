import { ok, Result } from "@/app/_shared/result-pattern/result";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { GroupesProximiteDTO } from "@/app/domains/groupes/dto/groupes-proximite.dto";
import { mapEntitiesToGroupesProximiteDTO } from "@/app/domains/groupes/mappers/groupes-proximite.mapper";
import { getGroupeGouvernementReferenceCode } from "@/app/domains/groupes/constants/groupe-gouvernement-reference.constants";
import { getGroupeLineage } from "@/app/domains/groupes/constants/groupe-lineage.constants";

export async function getGroupesProximiteUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupesProximiteDTO, never>> {
    const rows = await repository.getProximiteParPaire(legislature);

    return ok(mapEntitiesToGroupesProximiteDTO(
        rows,
        getGroupeGouvernementReferenceCode(legislature),
        getGroupeLineage(legislature)
    ));
}
