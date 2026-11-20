import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { GroupesAgeDTO } from "@/app/domains/groupes/dto/groupes-age.dto";
import { mapEntitiesToGroupesAgeDTO } from "@/app/domains/groupes/mappers/groupes-age.mapper";

export async function getGroupesAgeUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupesAgeDTO, "DB_ERROR">> {
    const read = await fromRepository(() => repository.getAgeParGroupe(legislature));
    if (isErr(read)) return read;

    return ok(mapEntitiesToGroupesAgeDTO(read.data));
}
