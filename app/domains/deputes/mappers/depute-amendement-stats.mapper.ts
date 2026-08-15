import { DeputeAmendementStatsEntity } from "@/app/domains/deputes/entities/depute-amendement-stats.entity";
import { DeputeAmendementStatsDTO } from "@/app/domains/deputes/dto/depute-amendement-stats.dto";

export function mapDeputeAmendementStatsEntityToDTO(entity: DeputeAmendementStatsEntity): DeputeAmendementStatsDTO {
    const totalDepose = Number(entity.total_depose);
    const totalAdopte = Number(entity.total_adopte);
    return {
        totalDepose,
        totalAdopte,
        tauxAdoption: totalDepose > 0 ? Math.round((totalAdopte / totalDepose) * 100) : 0,
    };
}
