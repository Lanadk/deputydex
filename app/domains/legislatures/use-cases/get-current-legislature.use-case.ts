import {ILegislaturesRepository} from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {mapLegislatureToDTO} from "@/app/domains/legislatures/mappers/legislature.mapper";

export async function getCurrentLegislatureUseCase(
    repository: ILegislaturesRepository
): Promise<Result<LegislatureDTO, "NOT_FOUND">> {
    const entity = await repository.getCurrent();

    if (!entity) return err("NOT_FOUND");

    return ok(mapLegislatureToDTO(entity));
}