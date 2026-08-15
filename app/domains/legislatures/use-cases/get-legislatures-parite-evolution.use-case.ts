import { ILegislaturesStatsRepository } from "@/app/domains/legislatures/repositories/ILegislaturesStatsRepository";
import { mapLegislaturePariteEvolutionToDTO } from "@/app/domains/legislatures/mappers/legislature-parite-evolution.mapper";
import { LegislaturePariteEvolutionDTO } from "@/app/domains/legislatures/dto/legislature-parite-evolution.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getLegislaturesPariteEvolutionUseCase(
    repository: ILegislaturesStatsRepository
): Promise<Result<LegislaturePariteEvolutionDTO, never>> {
    const rows = await repository.getPariteEvolution();
    return ok(mapLegislaturePariteEvolutionToDTO(rows));
}
