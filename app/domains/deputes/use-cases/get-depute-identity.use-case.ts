import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeIdentityRepository } from "@/app/domains/deputes/repositories/IDeputeIdentityRepository";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { mapDeputeIdentityEntityToDTO } from "@/app/domains/deputes/mappers/depute-identity.mapper";

export async function getDeputeIdentityUseCase(
    repository: IDeputeIdentityRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeIdentityDTO, "NOT_FOUND" | "ERROR">> {
    try {
        const entity = await repository.getDeputeIdentity(uid, legislature);
        if (!entity) return err("NOT_FOUND");
        return ok(mapDeputeIdentityEntityToDTO(entity, legislature));
    } catch {
        return err("ERROR");
    }
}
