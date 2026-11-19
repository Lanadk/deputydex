import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { mapScrutinDetailEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-detail.mapper";

export async function getScrutinDetailUseCase(
    repository: IScrutinDetailRepository,
    uid: string
): Promise<Result<ScrutinDetailDTO, "NOT_FOUND" | "ERROR">> {
    try {
        const entity = await repository.getScrutin(uid);
        if (!entity) return err("NOT_FOUND");
        return ok(mapScrutinDetailEntityToDTO(entity));
    } catch (e) {
        console.error(e);
        return err("ERROR");
    }
}
