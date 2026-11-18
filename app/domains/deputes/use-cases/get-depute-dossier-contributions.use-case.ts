import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { mapDeputeDossierContributionsEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-dossier-contribution.mapper";

export async function getDeputeDossierContributionsUseCase(
    repository: IDeputeDossiersRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeDossierContributionDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputeDossierContributions(uid, legislature);
        return ok(mapDeputeDossierContributionsEntitiesToDTOs(entities));
    } catch {
        return err("ERROR");
    }
}
