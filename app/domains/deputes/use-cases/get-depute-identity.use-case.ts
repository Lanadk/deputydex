import { Result, ok, err, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeIdentityRepository } from "@/app/domains/deputes/repositories/IDeputeIdentityRepository";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { mapDeputeIdentityEntityToDTO } from "@/app/domains/deputes/mappers/depute-identity.mapper";

export async function getDeputeIdentityUseCase(
    repository: IDeputeIdentityRepository,
    uid: string,
    legislature: number
): Promise<Result<DeputeIdentityDTO, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeIdentity(uid, legislature));
    if (isErr(result)) return result;
    const entity = result.data;

    if (!entity) return err("NOT_FOUND");
    return ok(mapDeputeIdentityEntityToDTO(entity, legislature));
}
