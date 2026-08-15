import { ok, Result } from "@/app/_shared/result-pattern/result";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import { GroupesFeminisationDTO } from "@/app/domains/groupes/dto/groupes-feminisation.dto";
import { mapEntitiesToGroupesFeminisationDTO } from "@/app/domains/groupes/mappers/groupes-feminisation.mapper";

export async function getGroupesFeminisationUseCase(
    repository: IGroupesStatsRepository,
    legislature: number
): Promise<Result<GroupesFeminisationDTO, never>> {
    const [pariteRows, mouvementRows] = await Promise.all([
        repository.getPariteParGroupe(legislature),
        repository.getFeminisationMouvements(legislature),
    ]);

    return ok(mapEntitiesToGroupesFeminisationDTO(pariteRows, mouvementRows));
}
