import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { mapDeputeDossierContributionsEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-dossier-contribution.mapper";

export async function getDeputeDossierContributionsUseCase(
    repository: IDeputeDossiersRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeDossierContributionDTO[], "DB_ERROR">> {
    // fromRepository journalise l'erreur : sans ça, une erreur SQL (ex. vue d'agrégation absente) est invisible côté serveur.
    const result = await fromRepository(() => repository.getDeputeDossierContributions(uid, legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapDeputeDossierContributionsEntitiesToDTOs(entities));
}
