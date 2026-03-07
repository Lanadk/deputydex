import "server-only";

import type { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import { mapLegislaturesToDTO } from "@/app/domains/legislatures/mappers/legislature.mapper";

export async function getAllLegislaturesUseCase(
    repository: ILegislaturesRepository
) {
    const entities = await repository.getAll();

    return mapLegislaturesToDTO(entities);
}