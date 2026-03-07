import "server-only";

import type { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import {mapLegislaturesToDTO} from "@/app/domains/legislatures/mappers/legislature.mapper";
import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {ok, Result} from "@/app/_shared/result-pattern/result";

export async function getAllLegislaturesUseCase(
    repository: ILegislaturesRepository
): Promise<Result<LegislatureDTO[], never>> {
    const entities = await repository.getAll();

    return ok(mapLegislaturesToDTO(entities));
}