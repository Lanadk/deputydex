import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { GroupesProximiteDTO } from "@/app/domains/groupes/dto/groupes-proximite.dto";
import { mapEntitiesToGroupesProximiteDTO } from "@/app/domains/groupes/mappers/groupes-proximite.mapper";
import { getGroupeGouvernementReferenceCode } from "@/app/domains/groupes/constants/groupe-gouvernement-reference.constants";
import { getGroupeLineage } from "@/app/domains/groupes/constants/groupe-lineage.constants";

export async function getGroupesProximiteUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupesProximiteDTO, "DB_ERROR">> {
    const read = await fromRepository(() => repository.getProximiteParPaire(legislature));
    if (isErr(read)) return read;

    return ok(mapEntitiesToGroupesProximiteDTO(
        read.data,
        getGroupeGouvernementReferenceCode(legislature),
        getGroupeLineage(legislature)
    ));
}
