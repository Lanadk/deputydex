import { Result, ok, err, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { mapScrutinDetailEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-detail.mapper";

export async function getScrutinDetailUseCase(
    repository: IScrutinDetailRepository,
    uid: string
): Promise<Result<ScrutinDetailDTO, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getScrutin(uid));
    if (isErr(result)) return result;
    const entity = result.data;

    if (!entity) return err("NOT_FOUND");
    return ok(mapScrutinDetailEntityToDTO(entity));
}
