import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IPresenceStatsRepository } from "@/app/domains/presence/repositories/IPresenceStatsRepository";
import { DeputeIndicateursRow } from "@/app/domains/presence/entities/presence-stats.entity";
import { DeputeIndicateursDTO } from "@/app/domains/presence/dto/depute-indicateurs.dto";

export function mapDeputeIndicateursToDTO(row: DeputeIndicateursRow): DeputeIndicateursDTO {
    return {
        uid: row.acteur_uid,
        joursAttendus: row.jours_attendus,
        tauxPresence: row.taux_presence,
        tauxPresenceSeance: row.taux_presence_seance,
        tauxPresenceCommission: row.taux_presence_commission,
        tauxParticipationScrutins: row.taux_participation_scrutins,
    };
}

/** Indicateurs de tous les députés d'une législature, pour colorer leurs sièges dans l'hémicycle. */
export async function getIndicateursDeputesUseCase(
    repository: IPresenceStatsRepository,
    legislature: number
): Promise<Result<DeputeIndicateursDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getIndicateursDeputes(legislature));
    if (isErr(result)) return result;
    return ok(result.data.map(mapDeputeIndicateursToDTO));
}
