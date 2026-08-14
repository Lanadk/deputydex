import {IGroupeLegislaturesRepository} from "@/app/domains/groupes/repositories/IGroupeLegislaturesRepository";
import {GroupeLegislaturesDTO} from "@/app/domains/groupes/dto/groupe-legislatures.dto";
import {ok, Result} from "@/app/_shared/result-pattern/result";
import {mapEntitiesToGroupeLegislaturesDTO} from "@/app/domains/groupes/mappers/groupe-legislatures.mapper";

/**
 * Liste les législatures pour lesquelles `groupeCode` existe réellement
 * (ex: "RE" n'existe qu'en 16e législature, "EPR" qu'en 17e — ce ne sont
 * pas des codes interchangeables). Retourne toujours ok(...), un code
 * inconnu produisant simplement une liste vide.
 */
export async function getGroupeLegislaturesUseCase(
    repository: IGroupeLegislaturesRepository,
    groupeCode: string
): Promise<Result<GroupeLegislaturesDTO, never>> {
    const entities = await repository.getGroupeLegislatures(groupeCode);

    return ok(mapEntitiesToGroupeLegislaturesDTO(entities));
}
