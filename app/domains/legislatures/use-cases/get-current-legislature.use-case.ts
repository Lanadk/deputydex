import {ILegislaturesRepository} from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {err, isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {mapLegislatureToDTO} from "@/app/domains/legislatures/mappers/legislature.mapper";

export async function getCurrentLegislatureUseCase(
    repository: ILegislaturesRepository
): Promise<Result<LegislatureDTO, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getCurrent());
    if (isErr(result)) return result;
    const entity = result.data;

    if (!entity) return err("NOT_FOUND");

    return ok(mapLegislatureToDTO(entity));
}
