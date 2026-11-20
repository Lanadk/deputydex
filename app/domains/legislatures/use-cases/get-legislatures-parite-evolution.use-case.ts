import { ILegislaturesStatsRepository } from "@/app/domains/legislatures/repositories/ILegislaturesStatsRepository";
import { mapLegislaturePariteEvolutionToDTO } from "@/app/domains/legislatures/mappers/legislature-parite-evolution.mapper";
import { LegislaturePariteEvolutionDTO } from "@/app/domains/legislatures/dto/legislature-parite-evolution.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getLegislaturesPariteEvolutionUseCase(
    repository: ILegislaturesStatsRepository
): Promise<Result<LegislaturePariteEvolutionDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getPariteEvolution());
    if (isErr(result)) return result;
    const rows = result.data;

    return ok(mapLegislaturePariteEvolutionToDTO(rows));
}
