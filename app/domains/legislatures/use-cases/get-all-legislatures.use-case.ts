import "server-only";

import type { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import {mapLegislaturesToDTO} from "@/app/domains/legislatures/mappers/legislature.mapper";
import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";

export async function getAllLegislaturesUseCase(
    repository: ILegislaturesRepository
): Promise<Result<LegislatureDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getAll());
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapLegislaturesToDTO(entities));
}
