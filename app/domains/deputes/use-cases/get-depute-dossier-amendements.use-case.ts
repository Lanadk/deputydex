import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { DeputeDossierAmendementDTO } from "@/app/domains/deputes/dto/depute-dossier-amendement.dto";
import { mapDeputeDossierAmendementsEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-dossier-amendement.mapper";

export async function getDeputeDossierAmendementsUseCase(
    repository: IDeputeDossiersRepository,
    uid: string,
    legislature: number,
    dossierUid: string
): Promise<Result<DeputeDossierAmendementDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputeDossierAmendements(uid, legislature, dossierUid);
        return ok(mapDeputeDossierAmendementsEntitiesToDTOs(entities));
    } catch {
        return err("ERROR");
    }
}
