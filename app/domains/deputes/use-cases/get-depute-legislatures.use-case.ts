import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeLegislaturesRepository } from "@/app/domains/deputes/repositories/IDeputeLegislaturesRepository";
import { DeputeLegislaturesDTO } from "@/app/domains/deputes/dto/depute-legislatures.dto";
import { mapEntitiesToDeputeLegislaturesDTO } from "@/app/domains/deputes/mappers/depute-legislatures.mapper";

/**
 * Liste les législatures pour lesquelles `uid` a effectivement siégé
 * (mandat de type ASSEMBLEE). Un député élu en 17e n'a par exemple aucun
 * mandat en 16e — la fiche doit alors griser cette législature dans le
 * sélecteur plutôt que d'appeler l'identité avec une législature où le
 * député n'existe pas.
 */
export async function getDeputeLegislaturesUseCase(
    repository: IDeputeLegislaturesRepository,
    uid: string
): Promise<Result<DeputeLegislaturesDTO, "ERROR">> {
    try {
        const entities = await repository.getDeputeLegislatures(uid);
        return ok(mapEntitiesToDeputeLegislaturesDTO(entities));
    } catch {
        return err("ERROR");
    }
}
