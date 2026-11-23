import { DeputeTendanceEntity } from "@/app/domains/deputes/entities/deputes-tendances.entity";
import { DeputeTendanceLigneDTO } from "@/app/domains/deputes/dto/deputes-tendances.dto";
import { mapDeputesCardToDTO } from "@/app/domains/deputes/mappers/deputes-cards.mapper";

export function mapDeputeTendanceEntityToDTO(entity: DeputeTendanceEntity): DeputeTendanceLigneDTO {
    return {
        depute: mapDeputesCardToDTO(entity),
        votesExprimes: Number(entity.votes_exprimes),
        votesRebelles: Number(entity.votes_rebelles),
        amendementsDeposes: Number(entity.amendements_deposes),
    };
}
