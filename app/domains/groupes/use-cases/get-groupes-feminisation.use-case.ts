import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { GroupesFeminisationDTO } from "@/app/domains/groupes/dto/groupes-feminisation.dto";
import { mapEntitiesToGroupesFeminisationDTO } from "@/app/domains/groupes/mappers/groupes-feminisation.mapper";

export async function getGroupesFeminisationUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupesFeminisationDTO, "DB_ERROR">> {
    const result = await fromRepository(() => Promise.all([
        repository.getPariteParGroupe(legislature),
        repository.getFeminisationMouvements(legislature),
    ]));
    if (isErr(result)) return result;
    const [pariteRows, mouvementRows] = result.data;

    return ok(mapEntitiesToGroupesFeminisationDTO(pariteRows, mouvementRows));
}
