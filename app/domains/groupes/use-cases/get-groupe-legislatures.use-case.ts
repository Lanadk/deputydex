import {IGroupeLegislaturesRepository} from "@/app/domains/groupes/repositories/IGroupeLegislaturesRepository";
import {GroupeLegislaturesDTO} from "@/app/domains/groupes/dto/groupe-legislatures.dto";
import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {mapEntitiesToGroupeLegislaturesDTO} from "@/app/domains/groupes/mappers/groupe-legislatures.mapper";

/**
 * Liste les législatures pour lesquelles `groupeCode` existe réellement
 * (ex: "RE" n'existe qu'en 16e législature, "EPR" qu'en 17e — ce ne sont
 * pas des codes interchangeables). Un code inconnu produit simplement une
 * liste vide (succès) ; seule une panne du repository est une erreur.
 */
export async function getGroupeLegislaturesUseCase(
    repository: IGroupeLegislaturesRepository,
    groupeCode: string
): Promise<Result<GroupeLegislaturesDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getGroupeLegislatures(groupeCode));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapEntitiesToGroupeLegislaturesDTO(entities));
}
